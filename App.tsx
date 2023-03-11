import * as React from 'react';
import './style.css';
const { useState, useEffect } = React;

interface ListItem{ id: number; data: string; checked: boolean }
interface InputModel{
  type:string,
  initialValue:string|number,
  options?:[label:string,value:string][],
  atrtributes?:object,
}
function List({initialList}:{initialList?:Omit<ListItem,'id'>[]}={initialList:[]}) {
  const [list, setList] =
    useState<ListItem[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(()=>{
    initialList?.map(item=>addItem(item))
  },[])
  function addItem({
    data,
    checked = false,
  }: {
    data: string;
    checked?: boolean;
  }) {
    setList([...list, { data, id: index, checked }]);
    setIndex(index + 1);
  }
  function handleAdd() {
    addItem({ data: '' });
  }
  function handleToggle(id: number) {
    const newList = list.map((item) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setList(newList);
  }
  function handleChange(id: number, text: string) {
    console.log({ list });
    const newList = list.map((item) => {
      if (item.id === id) {
        item.data = text;
      }
      return item;
    });
    setList(newList);
  }
  function handleDelete(id: number) {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  }
  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            value={item.checked.toString()}
            onChange={() => handleToggle(item.id)}
          />
          <input
            type="text"
            value={item.data}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(item.id, e.target.value)
            }
          />
          <button onClick={() => handleDelete(item.id)}>x</button>
        </div>
      ))}
      <button onClick={handleAdd}>add</button>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>list:</div>
      <List initialList={[{data:"test",checked:false}]} />
    </div>
  );
}
