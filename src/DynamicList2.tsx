import * as React from 'react';
const { useState, useEffect } = React;

type Primitive = string | number | boolean;

type F = InputAttr<InputType> | SelectAttr | CheckboxAttr | TextareaAttr;
type Readable<T> = T | Readonly<T>;
export type FormModel<N> = N extends 1 ? Readable<[F]> : N extends 2 ? Readable<[F, F]> : N extends 3 ? Readable<[F, F, F]> : N extends 4 ? Readable<[F, F, F, F]> : N extends 5 ? Readable<[F, F, F, F, F]> : N extends 6 ? Readable<[F, F, F, F, F, F]> : N extends 7 ? Readable<[F, F, F, F, F, F, F]> : N extends 8 ? Readable<[F, F, F, F, F, F, F, F]> : N extends 9 ? Readable<[F, F, F, F, F, F, F, F, F]> : Readable<[F, F, F, F, F, F, F, F, F, F]>;

type DataObj<K extends { name: string, type: string; }> = {
	[name in K['name']]: K['type'] extends 'checkbox' ? boolean : string;
};

export type DataModel<FM extends FormModel<N>, N extends number> = N extends 1
	? DataObj<FM[0]>
	: N extends 2
	? DataObj<FM[0]> & DataObj<FM[1]>
	: N extends 3
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]>
	: N extends 4
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]>
	: N extends 5
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]>
	: N extends 6
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]> & DataObj<FM[5]>
	: N extends 7
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]> & DataObj<FM[5]> & DataObj<FM[6]>
	: N extends 8
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]> & DataObj<FM[5]> & DataObj<FM[6]> & DataObj<FM[7]>
	: N extends 9
	? DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]> & DataObj<FM[5]> & DataObj<FM[6]> & DataObj<FM[7]> & DataObj<FM[8]>
	: DataObj<FM[0]> & DataObj<FM[1]> & DataObj<FM[2]> & DataObj<FM[3]> & DataObj<FM[4]> & DataObj<FM[5]> & DataObj<FM[6]> & DataObj<FM[7]> & DataObj<FM[8]> & DataObj<FM[9]>
	;
// const test1 = [{ type: 'text', name: 'test', defaultValue: "default value" as string }
// ] as const;
// const test2 = [{ type: 'text', name: 'test', defaultValue: "default value" as string },
// { type: 'checkbox', name: 'test2', defaultValue: false }
// ] as const;
// const test3 = [{ type: 'text', name: 'test', defaultValue: "default value" as string },
// { type: 'checkbox', name: 'test2', defaultValue: false },
// { type: 'number', name: 'test3', defaultValue: "4", }
// ] as const;
// type Test1 = DataModel<typeof test1, 1>;
// type Test2 = DataModel<typeof test2, 2>;
// type Test3 = DataModel<typeof test3, 3>;
// const test2val: Test3 = {
// 	test: "true",
// 	test2: true,
// 	test3: 'too',
// 	test4: 4,
// };
interface InputAttr<T> {
	type: T,
	name: string,
	label?: React.ReactNode,
	defaultValue: T extends 'checkbox' ? boolean : string,
	required?: boolean,
	attributes?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
}

type WithId<T extends object> = T & { id: number | string; };
export type InputType = "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "tel" | "text" | "time" | "url" | "week";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

interface DynamicListProps<T extends FormModel<N>, N extends number> {
	formModel: T | Readonly<T>,
	data: Readable<DataModel<T, N>[]>,
	setData: Setter<DataModel<T, N>[]>,
	unit:N
}

export default function DynamicList2<T extends FormModel<N>, N extends number>({ formModel, data, setData }: DynamicListProps<T, N>) {
	const [index, setIndex] = useState(0);
	const [list, setList] = useState<WithId<DataModel<T, N>>[]>(()=>data.map(item=>withId(item)));

	useEffect(() => {
		console.log('list has changed', list);
		setData(list);
	}, [list]);
	function withId(initialValue: DataModel<T,N>):WithId<DataModel<T,N>>{
		const id = (typeof initialValue?.id == 'string' || typeof initialValue?.id == 'number') ? initialValue.id : index; // NOTE initialValue.id be prioritized over index, overwriting the original id may cause errors
		setIndex((index) => index + 1);
		return { ...initialValue, id, };
	}
	function addItem(initialValue: DataModel<T,N>) {
		setList((list) => [...list, withId(initialValue)]);
	}
	function handleAdd() {
		const newItem: DataModel<T,N> = formModel.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue })) as unknown as DataModel<T,N>;
		addItem(newItem);
	}
	function handleChange(id: string | number, name: keyof WithId<DataModel<T,N>> & string, value: Primitive) {
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
					{formModel.map((field:F) => (
						<div key={field.name} >
							{
								(() => {
									const attr = { field, item, handleChange } as any; // FIXME
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


interface InputParam<T extends WithId<DataObj<{name:U, type:InputType}>>, U extends keyof T & string> {
	field: InputAttr<InputType>,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}
function Input<T extends WithId<DataObj<{name:U, type:InputType}>>, U extends keyof T & string>({ field, item, handleChange }: InputParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<input
				{...field}
				value={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.id, field.name, e.target.value)}
			/>
		</>
	);
}
type SelectAttr = InputAttr<'select'> & { options: [label: string, value: string][]; };
interface SelectParam<T extends WithId<DataObj<{name:U, type:'select'}>>, U extends keyof T & string> {
	field: SelectAttr,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}
function Select<T extends WithId<DataObj<{name:U, type:'select'}>>, U extends keyof T & string>({ field, item, handleChange }: SelectParam<T, U>) {
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
type CheckboxAttr = InputAttr<'checkbox'>;
interface CheckboxParam<T extends WithId<DataObj<{name:U, type:'checkbox'}>>, U extends keyof T & string> {
	field: CheckboxAttr,
	item: T,
	handleChange: (id: string | number, name: U, value: boolean) => void;
}
function Checkbox<T extends WithId<DataObj<{name:U, type:'checkbox'}>>, U extends keyof T & string>({ field, item, handleChange }: CheckboxParam<T, U>) {
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
type TextareaAttr = InputAttr<'textarea'>;
interface TextareaParam<T extends WithId<DataObj<{name:U, type:'textarea'}>>, U extends keyof T & string> {
	field: TextareaAttr,
	item: T,
	handleChange: (id: string | number, name: keyof T & string, value: string) => void;
}
function Textarea<T extends WithId<DataObj<{name:U, type:'textarea'}>>, U extends keyof T & string>({ field, item, handleChange }: TextareaParam<T, U>) {
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
