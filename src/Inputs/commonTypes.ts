export interface InputAttr<T> {
	type: T,
	name: string,
	label?: React.ReactNode,
	defaultValue: T extends 'checkbox' ? boolean : string,
	required?: boolean,
	attributes?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
}

export type Primitive = string | number | boolean;

export type F = InputAttr<InputType> | SelectAttr | CheckboxAttr | TextareaAttr;
export type Readable<T> = T | Readonly<T>;
export type FormModel<N> = N extends 1 ? Readable<[F]> : N extends 2 ? Readable<[F, F]> : N extends 3 ? Readable<[F, F, F]> : N extends 4 ? Readable<[F, F, F, F]> : N extends 5 ? Readable<[F, F, F, F, F]> : N extends 6 ? Readable<[F, F, F, F, F, F]> : N extends 7 ? Readable<[F, F, F, F, F, F, F]> : N extends 8 ? Readable<[F, F, F, F, F, F, F, F]> : N extends 9 ? Readable<[F, F, F, F, F, F, F, F, F]> : Readable<[F, F, F, F, F, F, F, F, F, F]>;

export type TextareaAttr = InputAttr<'textarea'>;
export interface TextareaParam<T extends WithId<DataObj<{name:U, type:'textarea'}>>, U extends keyof T & string> {
	field: TextareaAttr,
	item: T,
	handleChange: (id: string | number, name: keyof T & string, value: string) => void;
}
export type CheckboxAttr = InputAttr<'checkbox'>;
export interface CheckboxParam<T extends WithId<DataObj<{name:U, type:'checkbox'}>>, U extends keyof T & string> {
	field: CheckboxAttr,
	item: T,
	handleChange: (id: string | number, name: U, value: boolean) => void;
}

export type SelectAttr = InputAttr<'select'> & { options: [label: string, value: string][]; };
export interface SelectParam<T extends WithId<DataObj<{name:U, type:'select'}>>, U extends keyof T & string> {
	field: SelectAttr,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}

export interface InputParam<T extends WithId<DataObj<{name:U, type:InputType}>>, U extends keyof T & string> {
	field: InputAttr<InputType>,
	item: T,
	handleChange: (id: string | number, name: U, value: string) => void;
}



export type DataObj<K extends { name: string, type: string; }> = {
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

export type WithId<T extends object> = T & { id: number | string; };
export type InputType = "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "tel" | "text" | "time" | "url" | "week";