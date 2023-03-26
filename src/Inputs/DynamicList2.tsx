import * as React from 'react';
import type { InputAttr,FormModel,DataModel,Primitive, WithId, DataObj,InputType,InputParam,F, Readable,SelectParam,  TextareaParam, CheckboxParam } from './commonTypes';
const { useState, useEffect } = React; 

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
		const id = ('id' in initialValue) ? initialValue.id as number|string: index; // NOTE initialValue.id be prioritized over index, overwriting the original id may cause errors
		setIndex((index) => index + 1);
		return { ...initialValue, id, };
	}
	function addItem(initialValue: DataModel<T,N>) {
		//console.log("addItem",{initialValue})
		setList((list) => [...list, withId(initialValue)]);
	}
	function handleAdd(e) {
		e.preventDefault();
		const newItem: DataModel<T,N> = formModel.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue }),{}) as unknown as DataModel<T,N>;
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
		<div className='flex flex-col my-3'>
			{list.map((item) => (
				<div key={item.id} className='flex flex-row items-center my-2'>
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
					<button 
			className='h-6 w-6 bg-slate-200 rounded-md hover:bg-slate-300 active:bg-slate-400'
					onClick={() => handleDelete(item.id)}>x</button>
				</div>
			))}
			<button 
			className='m-2 h-8 w-3/4 bg-slate-200 rounded-md hover:bg-slate-300 active:bg-slate-400'
			onClick={handleAdd}>add</button>
		</div>
	);
}



function Input<T extends WithId<DataObj<{name:U, type:InputType}>>, U extends keyof T & string>({ field, item, handleChange }: InputParam<T, U>) {
	return (
		<div className="relative">
			{field.label && <label htmlFor={field.name} className='text-sm text-slate-800 absolute -top-4'>{field.label}</label>}
			<input
			className='border-2 border-slate-300 rounded-md p-1 m-1'
				{...field}
				value={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.id, field.name, e.target.value)}
			/>
		</div>
	);
}

function Select<T extends WithId<DataObj<{name:U, type:'select'}>>, U extends keyof T & string>({ field, item, handleChange }: SelectParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<select
			className='border-2 border-slate-300 rounded-md p-1'
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

function Checkbox<T extends WithId<DataObj<{name:U, type:'checkbox'}>>, U extends keyof T & string>({ field, item, handleChange }: CheckboxParam<T, U>) {
	return (
		<>
			<input
				{...field}
			className='h-6 w-6 m-2'
				defaultValue={field.name}
				value={field.name}
				checked={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(item.id, field.name, e.target.checked)}
			/>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
		</>
	);
}

function Textarea<T extends WithId<DataObj<{name:U, type:'textarea'}>>, U extends keyof T & string>({ field, item, handleChange }: TextareaParam<T, U>) {
	return (
		<>
			{field.label && <label htmlFor={field.name}>{field.label}</label>}
			<textarea
			className='border-2 border-slate-300 rounded-md p-1'
				{...field}
				value={item[field.name]}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(item.id, field.name, e.target.value)}
			/>
		</>
	);
}
