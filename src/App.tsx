import * as React from 'react';
import './style.css';
import { NestedForm } from './Inputs/NestedForm';

const { useState } = React;

export default function App() {
  const prop = [
    { name: 'hi', defaultValue: 'hey', type: 'text' },
    { name: 'age', defaultValue: '4', type: 'number' },
    {
      name: 'nested',
      type: 'nested',
      unit:4,
      model: [
        {
          type: 'checkbox',
          name: 'checked',
          defaultValue: false,
        },
        {
          type: 'text',
          name: 'name',
          defaultValue: 'John',
        },
        {
          type: 'text',
          name: 'addr',
          defaultValue: 'America',
        },
        {
          type: 'text',
          name: 'email',
          defaultValue: 'ama@aaa.com',
        },
      ],
    },
  ] as const;
  return (
    <div>
      <div>list:</div>
      <NestedForm properties={prop} />
      {/* <DynamicList2 data={data} setData={setData} formModel={formModel} unit={3} /> */}
    </div>
  );
}
