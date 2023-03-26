import * as React from 'react';
import './style.css';
import { NestedForm } from './Inputs/NestedForm';
import type { F } from './Inputs/commonTypes';
const { useState } = React;

export default function App() {
  const prop = [
    { name: 'name', defaultValue: 'John', type: 'text', label: 'Name' },
    {
      name: 'email',
      defaultValue: 'john@example.com',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'profile',
      type: 'nested',
      label: 'Profile',
      unit: 3,
      model: [
        { name: 'age', label: 'Age', defaultValue: '24', type: 'number' },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          defaultValue: 'male',
          options: [
            ['male', 'male'],
            ['female', 'female'],
            ['other', 'other'],
          ],
        },
        {
          name: 'greeting',
          defaultValue: 'hey',
          type: 'text',
          label: 'Greeting',
        },
      ],
    },

    {
      name: 'friends',
      type: 'nested-iterable',
      label: 'Friends',
      unit: 3,
      model: [
        {
          type: 'checkbox',
          name: 'checked',

          defaultValue: false,
        },
        {
          type: 'text',
          name: 'name',
          label: 'Name',
          defaultValue: '',
        },
        {
          type: 'text',
          name: 'email',
          label: 'Email',
          defaultValue: '',
        },
      ],
    },
  ] as const;
  return (
    <div className="m-6">
      <NestedForm properties={prop} />
    </div>
  );
}
