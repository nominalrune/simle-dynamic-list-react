import DynamicList from './DynamicList2';
import type { InputAttr } from './commonTypes';
import * as React from 'react';
import { FormModel, InputType, SelectAttr, Readable, WithId,F,DataObj } from './commonTypes';

type Attr<N extends number=1|2|3|4|5|6|7|8|9> =F
  | {
      type: 'nested';
      name: string;
      label?: React.ReactNode;
      unit:N,
      model: FormModel<N>;
    };

interface Property<T extends Attr[]> {
  properties: Readonly<T>;
}
export function NestedForm<T extends Attr[]>({ properties }: Property<T>) {
  const [data, _setData] = React.useState(
    properties.reduce(
      (acc, curr) => {
        if (curr.type !== 'nested') {
          return { ...acc, [curr.name]: curr.defaultValue };
        } else {
          return {
            ...acc,
            [curr.name]: ([
              curr.model.reduce((_acc, _curr) => {
              return { ..._acc, [_curr.name]: _curr.defaultValue };
            },{})
            ] as unknown as [{ [key: string]: string | boolean }]),
          };
        }
      },
      {} as {
        [key in keyof T[number]]:T[number][key];
      }
    )
  );

  // EditFormの処理

  const [processing, setProcessing] = React.useState(false);
  function setData<M extends number>(
    key: T[M]['name'],
    value: any //T[M]['type'] extends 'nested'?T[M]['model'][number]["defaultValue"]:T[M]["defaultValue"]
  ) {
    _setData({ ...data, [key]: value });
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ){
    // console.log({ data });
    if (event.target.type === 'checkbox') {
      setData(event.target.name, event.target.checked);
    }else if(event.target.type !== 'nested'){
setData(
      event.target.name,
      event.target.value
    );
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const url = 'test_url'; //route + (urlParams ?? ""); // FIXME
    setProcessing(true);
    // axios({ method, url, data }).then(res => {
    // 	setProcessing(false);
    // 	console.log("responce: ", res);
    // 	// handleSuccess && handleSuccess(res);
    // }).finally(() => {
    // 	setProcessing(false);
    // });
  };

  return (
    <form onSubmit={handleSubmit}>
      {properties.map((prop,i) =>
        prop.type === 'hidden' ? (
          <div key={'input_' + prop.name}></div> // no need to show data because the value is already set
        ) : (
          <div key={'input_' + prop.name} className="mt-4">
            <label htmlFor={prop.name}>{prop.label ?? ''}</label>
            {(() => {
              if (prop.type === 'select') {
                return (
                  <Select
                    name={prop.name}
                    value={data[prop.name] ?? ''}
                    options={prop.options}
                    handleChange={handleChange}
                  />
                );
              } else if (prop.type === 'nested') {
                return (
                  <DynamicList
                    formModel={prop.model}
                    data={data[prop.name]}
                    setData={(_value) => {
                      const value=typeof _value=='function'?_value(data[prop.name]):_value;
                      setData(prop.name, value);
                    }}
                    unit={prop.unit}
                  />
                );
              } else {
                return (
                  <input
                    type={prop.type}
                    name={prop.name}
                    value={data[prop.name]}
                    onChange={handleChange}
                  />
                );
              }
            })()}
            {/* <InputError message={errors.email} className="mt-2" /> */}
          </div>
        )
      )}
      <div className="flex items-center justify-end mt-4">
        <button>submit</button>
      </div>
      <div>data: {JSON.stringify(data)}</div>
    </form>
  );
}

function Input<
  T extends WithId<DataObj<{ name: U; type: InputType }>>,
  U extends keyof T & string
>({ field, item, handleChange }: InputParam<T, U>) {
  return (
    <>
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
      <input
        {...field}
        value={item[field.name]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(item.id, field.name, e.target.value)
        }
      />
    </>
  );
}

function Select<
  T extends WithId<DataObj<{ name: U; type: 'select' }>>,
  U extends keyof T & string
>({ field, item, handleChange }: SelectParam<T, U>) {
  return (
    <>
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
      <select
        {...field}
        value={item[field.name].toString()}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleChange(item.id, field.name, e.target.value)
        }
      >
        {field.options.map(([label, value]) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

function Checkbox<
  T extends WithId<DataObj<{ name: U; type: 'checkbox' }>>,
  U extends keyof T & string
>({ field, item, handleChange }: CheckboxParam<T, U>) {
  return (
    <>
      <input
        {...field}
        defaultValue={field.name}
        value={field.name}
        checked={item[field.name]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(item.id, field.name, e.target.checked)
        }
      />
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
    </>
  );
}

function Textarea<
  T extends WithId<DataObj<{ name: U; type: 'textarea' }>>,
  U extends keyof T & string
>({ field, item, handleChange }: TextareaParam<T, U>) {
  return (
    <>
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
      <textarea
        {...field}
        value={item[field.name]}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleChange(item.id, field.name, e.target.value)
        }
      />
    </>
  );
}
