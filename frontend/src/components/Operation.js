import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setEditting } from '../store/showSlice';
import { setChosenItem } from '../store/targetSlice.js';

export default function Operation() {
  const editting = useSelector(state => state.show.editting);
  const bucketList = useSelector(state => state.target.bucketList);
  const chosenItem = useSelector(state => state.target.chosenItem);
  const dispatch = useDispatch();
  const target = bucketList.find(item => item.id === chosenItem);

  function Complete(next) {
    const newitem = structuredClone(target);
    newitem.completed = next;
    fetch(process.env.REACT_APP_API_PATH + "/test", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newitem)
    })
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));
  }

  function Delete() {
    fetch(process.env.REACT_APP_API_PATH + "/test", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id: chosenItem})
    })
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));
    dispatch(setChosenItem(-1));
  }

  if(!target){
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        Operation
      </div>
    );
  }else if(editting) {
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        <button type="submit" form="editForm" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2">
          Save
        </button>
      </div>
    );
  }else{
    if(!("completed" in target)) console.log("Error in 'Operation': target has no 'comp'");
    else return (
      <div className="w-96 max-[480px]:w-80 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        {target.completed===1 &&
          <button onClick={() => Complete(0)} type="button" className="text-blue-700 border border-blue-700 hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2">
            UnComp
          </button>
        }{target.completed===0 &&
          <button onClick={() => Complete(1)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2">
            Comp
          </button>
        }
        <button onClick={() => dispatch(setEditting(true))} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2">
          Edit
        </button>
        <button onClick={Delete} type="button" className="text-red-700 border border-red-700 hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2">
          Delete
        </button>
      </div>
    );
  }
}