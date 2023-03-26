import DynamicList from './DynamicList2';
import type { InputAttr } from './commonTypes';
import * as React from 'react';
import {
  FormModel,
  InputType,
  SelectAttr,
  Readable,
  WithId,
  F,
  DataObj,
  InputParam,
} from './commonTypes';

type Attr<N extends number = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> =
  | F
  | {
      type: 'nested-iterable';
      name: string;
      label?: React.ReactNode;
      unit: N;
      model: FormModel<N>;
    }
  | {
      type: 'nested';
      name: string;
      label?: React.ReactNode;
      unit: N;
      model: FormModel<N>;
    };

interface Property<T extends Attr[]> {
  properties: Readable<T>;
  handleSubmit?: (data: { [key in keyof T[number]]: T[number][key] }) => any;
  level?: number;
}
export function NestedForm<T extends Attr[]>({
  properties,
  handleSubmit,
  level = 0,
}: Property<T>) {
  const [data, _setData] = React.useState(
    properties.reduce((acc, curr) => {
      if (curr.type === 'nested-iterable') {
        return {
          ...acc,
          [curr.name]: [
            curr.model.reduce((_acc, _curr) => {
              return { ..._acc, [_curr.name]: _curr.defaultValue };
            }, {}),
          ] as unknown as [{ [key: string]: string | boolean }],
        };
      } else if (curr.type === 'nested') {
        return {
          ...acc,
          [curr.name]: curr.model.reduce((_acc, _curr) => {
            return { ..._acc, [_curr.name]: _curr.defaultValue };
          }, {}) as unknown as { [key: string]: string | boolean },
        };
      } else {
        return { ...acc, [curr.name]: curr.defaultValue };
      }
    }, {}) as {
      [key in keyof T[number]]: T[number][key];
    }
  );

  // EditFormの処理

  const [processing, setProcessing] = React.useState(false);
  function setData<M extends number>(
    key: T[M]['name'],
    value: any //T[M]['type'] extends 'nested-iterable'?T[M]['model'][number]["defaultValue"]:T[M]["defaultValue"]
  ) {
    _setData({ ...data, [key]: value });
  }

  function handleChange<Elm extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    event: React.ChangeEvent<Elm>
  ) {
    // console.log({ data });
    if (event.target.type === 'checkbox') {
      setData(event.target.name, event.target.checked);
    } else if (event.target.type !== 'nested-iterable') {
      setData(event.target.name, event.target.value);
    }
  }
  return (
    <form onSubmit={() => handleSubmit(data)} className={`flex ${level===0?"flex-col":"flex-row"}`} >
      {properties.map((prop, i) =>
        prop.type === 'hidden' ? (
          <div key={'input_' + prop.name}></div> // no need to show data because the value is already set
        ) : (
          <div key={'input_' + prop.name} className={`mt-4 flex flex-col relative`}>
              <label htmlFor={prop.name}  className='text-sm text-slate-800 absolute -top-4' >{prop.label ?? ''}</label>
              {(() => {
                if (prop.type === 'select') {
                  return (
                    <select

                      className="border-2 border-slate-300 rounded-md p-1 m-1"
                      value={prop.defaultValue}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleChange(e)
                      }
                    >
                      {prop.options.map(([label, value]) => (
                        <option key={label} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  );
                } else if (prop.type === 'nested-iterable') {
                  return (
                    <DynamicList
                      formModel={prop.model}
                      data={data[prop.name]}
                      setData={(_value) => {
                        const value =
                          typeof _value == 'function'
                            ? _value(data[prop.name])
                            : _value;
                        setData(prop.name, value);
                      }}
                      unit={prop.unit}
                    />
                  );
                } else if (prop.type === 'nested') {
                  return (
                    <div className="mx-3"><NestedForm properties={prop.model} level={level + 1} /></div>
                  );
                } else {
                  return (
                    <input
                      className="border-2 border-slate-300 rounded-md p-1 m-1"
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
      {level === 0 && (
        <div className="flex items-center justify-end mt-4">
          <button 
			className='p-1 m-1 bg-slate-200 border-2 border-slate-400 rounded-md hover:bg-slate-300 active:bg-slate-400'>submit</button>
        </div>
      )}

      {level === 0 && <div className="mt-32">data: {JSON.stringify(data)}</div>}
    </form>
  );
}
