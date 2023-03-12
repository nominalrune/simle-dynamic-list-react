import * as React from 'react';
import './style.css';
import DynamicList from './DynamicList';
import DynamicList2 from './DynamicList2';
const { useState } = React;

export default function App() {
  const formModel = [
    {
      type: "checkbox",
      name: "checked" as "checked",
      defaultValue: false
    }, {
      type: "text",
      name: "data" as "data",
      defaultValue: 'true'
    }
  ] as const;
  const [data, setData] = useState([{ data: "test", checked: true },{ data: "test2", checked: "false" }]);
  // NOTE FormModel からdataの型を推論するバージョンがほしい
  return (
    <div >
      <div>list:</div>
      <DynamicList data={data} setData={setData} formModel={formModel} />
      <DynamicList2 data={data} setData={setData} formModel={formModel} />
    </div>
  );
}
