import * as React from 'react';
const { useState, useEffect } = React;

type Primitive = string | number | boolean;
interface Value { [name: string]: Primitive; };
type FormDataObj<K extends string,U extends 'checkbox'|'select'|'textarea'|InputType> = {
	[name in K]:  U extends 'checkbox' ? boolean : string;
} & { [name: string]: Primitive; };


type WithId<T extends object> = T & { id: number | string; };
export type InputType = "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "tel" | "text" | "time" | "url" | "week";

export type FormModel<T extends string> = (InputAttr<InputType, T> | SelectAttr<T> | CheckboxAttr<T> | TextareaAttr<T>)[];

interface InputAttr<T, U> {
	type: T,
	name: U,
	label?: React.ReactNode,
	defaultValue: T extends 'checkbox' ? boolean : string,
	required?: boolean,
	attributes?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
interface DynamicListProps<T> {
	formModel: FormModel<keyof T & string>|Readonly<FormModel<keyof T & string>>,
	data: T[]|Readonly<T[]>,
	setData: Setter<T[]>,
}

export default function DynamicList<T extends Value>({ formModel, data = [], setData }: DynamicListProps<T>) {
	const [index, setIndex] = useState(0);
	const [list, setList] = useState<WithId<T>[]>(()=>data.map(item=>withId(item)));
	useEffect(() => {
		console.log('list has changed', list);
		setData(list);
	}, [list]);
	function withId(initialValue: T):WithId<T>{
		const id = (typeof initialValue?.id == 'string' || typeof initialValue?.id == 'number') ? initialValue.id : index; // NOTE initialValue.id be prioritized over index, overwriting the original id may cause errors
		setIndex((index) => index + 1);
		return { ...initialValue, id, };
	}
	function addItem(initialValue: T) {
		setList((list) => [...list, withId(initialValue)]);
	}
	function handleAdd() {
		const newItem:T = formModel.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue })) as unknown as T;
		addItem(newItem);
	}
	function handleChange(id: string | number, name: keyof T & string, value: Primitive) {
		const newList = list.map(item => (item.id === id ? { ...item, [name]: value } : item));
		setList(newList);
	}
	function handleDelete(id: string | number) {
		const newList = list.filter((item) => item.id !== id);
		setList(newList);
	}
	return (
		<div className='flex flex-col'>
			{list.map((item) => (
				<div key={item.id} className='flex flex-row'>
					{formModel.map((field) => (
						<div key={field.name} >
							{
								(() => {
									const attr = {field, item, handleChange }as any;
										// {
										// field:(typeof field)['type'] extends 'checkbox'?CheckboxParam<WithId<FormDataObj<(typeof field)['name'], "checkbox">>,(typeof field)['name']>:typeof field['type'] extends 'select'?SelectParam<WithId<FormDataObj<typeof field.name, "select">>,typeof field.name>:typeof field['type'] extends 'textarea'?TextareaParam<WithId<FormDataObj<typeof field.name, "textarea">>,typeof field.name>:typeof field['type'] extends InputType?InputParam<WithId<FormDataObj<typeof field.name, InputType>>,typeof field.name>:unknown;
										// item: WithId<Obj<typeof field.name, typeof field['type'] extends 'checkbox'?boolean:string>>, 
										// handleChange: (id: string | number, name: keyof T & string, value: typeof field['type'] extends 'checkbox'?boolean:string) => void
										// };
									switch (field.type) {
										case 'select': return <Select {...attr} />;
										case 'checkbox': return <Checkbox {...attr} />;
										case 'textarea': return <Textarea {...attr} />;
										default: return <Input {...attr} />;
									}
								})()
							}
						</div>
					))}
					<button onClick={() => handleDelete(item.id)}>x</button>
				</div>
			))}
			<button onClick={handleAdd}>add</button>
		</div>
	);
}


interface InputParam<T extends WithId<FormDataObj<U, InputType>>, U extends keyof T & string> {
	field: InputAttr<InputType, U>,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}
function Input<T extends WithId<FormDataObj<U, InputType>>, U extends keyof T & string>({ field, item, handleChange }: InputParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<input
				{...field}
				value={item[field.name].toString()}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.id, field.name, e.target.value)}
			/>
		</>
	);
}
type SelectAttr<T> = InputAttr<'select', T> & { options: [label: string, value: string][]; };
interface SelectParam<T extends WithId<FormDataObj<U, 'select'>>, U extends keyof T & string> {
	field: SelectAttr<U>,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}
function Select<T extends WithId<FormDataObj<U, 'select'>>, U extends keyof T & string>({ field, item, handleChange }: SelectParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<select
				{...field}
				value={item[field.name].toString()}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(item.id, field.name, e.target.value)}
			>
				{field.options.map(([label, value]) => (
					<option key={label} value={value}>{label}</option>
				))}
			</select>
		</>
	);
}
type CheckboxAttr<T> = InputAttr<'checkbox', T>;
interface CheckboxParam<T extends WithId<FormDataObj<U, 'checkbox'>>, U extends keyof T & string> {
	field: CheckboxAttr<U>,
	item: T,
	handleChange: (id: string | number, name: U, value: boolean) => void;
}
function Checkbox<T extends WithId<FormDataObj<U, 'checkbox'>>, U extends keyof T & string>({ field, item, handleChange }: CheckboxParam<T, U>) {
	return (
		<>
			<input
				{...field}
				defaultValue={field.name}
				value={field.name}
				checked={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.id, field.name, e.target.checked)}
			/>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
		</>
	);
}
type TextareaAttr<T> = InputAttr<'textarea', T>;
interface TextareaParam<T extends WithId<FormDataObj<U, 'textarea'>>, U extends keyof T & string> {
	field: TextareaAttr<U>,
	item: T,
	handleChange: (id: string | number, name: keyof T & string, value: string) => void;
}
function Textarea<T extends WithId<FormDataObj<U, 'textarea'>>, U extends keyof T & string>({ field, item, handleChange }: TextareaParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<textarea
				{...field}
				value={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(item.id, field.name, e.target.value)}
			/>
		</>
	);
}
