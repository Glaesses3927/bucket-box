import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

import { setEditting } from '../store/showSlice.js';
import { setChosenItemId } from '../store/targetSlice.js';
import { setChosenItemTable } from '../store/targetSlice.js';
import { setBucketList } from '../store/targetSlice.js';

export default function Control() {
  const editting = useSelector(state => state.show.editting);
  const bucketList = useSelector(state => state.target.bucketList);
  const chosenItemId = useSelector(state => state.target.chosenItemId);
  const chosenItemTable = useSelector(state => state.target.chosenItemTable);
  const dispatch = useDispatch();
  const target = bucketList.find(item => (item.id === chosenItemId) && (item.tableid === chosenItemTable));
  const { getAccessTokenSilently } = useAuth0();
  let token;

  function Complete(next) {
    const newitem = structuredClone(target);
    newitem.completed = next;

    (async () => {
      try {
        const fetcherr = new Error('[Error]: fetch');
        token = await getAccessTokenSilently();
        let res = await fetch(process.env.REACT_APP_API_PATH + "/v1", {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(newitem)
        })
        if(!res.ok) throw fetcherr;
        let data = await res.json();
        console.log('Success:', data);
        res = await fetch(`${process.env.REACT_APP_API_PATH}/v1?_=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(!res.ok) throw fetcherr;
        data = await res.json();
        dispatch(setBucketList(data));
      } catch (err) {
        console.error(err);
        alert(err);
      }
    })();
  }

  function Delete() {
    (async () => {
      try {
        const fetcherr = new Error('[Error]: fetch');
        token = await getAccessTokenSilently();
        let res = await fetch(process.env.REACT_APP_API_PATH + "/v1", {
          method: 'DELETE',
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({tableid: chosenItemTable, id: chosenItemId})
        })
        if(!res.ok) throw fetcherr;
        let data = await res.json();
        console.log('Success:', data);
        res = await fetch(`${process.env.REACT_APP_API_PATH}/v1?_=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(!res.ok) throw fetcherr;
        data = await res.json();
        dispatch(setBucketList(data));
      } catch (err) {
        console.error(err);
        alert(err);
      }
    })();
    
    dispatch(setChosenItemId(-1));
    dispatch(setChosenItemTable(""));
  }

  if(!target){
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        No item selected.
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
    return (
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