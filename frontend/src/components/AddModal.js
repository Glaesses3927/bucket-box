import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { useSelector, useDispatch } from 'react-redux';
import { setShowAddModal } from "../store/showSlice.js";
import { setBucketList } from '../store/targetSlice.js';

export default function AddModal(){
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const showAddModal = useSelector(state => state.show.showAddModal);
  const bucketTable = useSelector(state => state.target.bucketTable);

  function addItem(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const due_date = form.get("due_date") || "";
    const location = form.get("location") || "";
    const url = form.get("url") || "";
    const tableid = form.get("tableid") || "";
    const newitem = { title: title, description: description, due_date: due_date, location: location, url: url, completed: 0, tableid: tableid};

    (async () => {
      try {
        const fetcherr = new Error('[Error]: fetch');
        const token = await getAccessTokenSilently();
        let res = await fetch(process.env.REACT_APP_API_PATH + "/v1", {
          method: 'POST',
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
      }
    })();
    dispatch(setShowAddModal(false));
  };

  return (
    <>
      {showAddModal && 
        <>
          <div className="flex bg-gray-900/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add to BucketBox
                  </h3>
                  <button type="button" onClick={() => dispatch(setShowAddModal(false))} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <form className="p-4 md:p-5" onSubmit={addItem}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                      <input type="text" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type Title" required="" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="due_date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                      <input type="date" name="due_date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="tableid" className="block mb-2 text-sm font-medium text-gray-900">Table</label>
                      <select name="tableid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        {bucketTable.map(item => 
                          <option value={item.tableid} key={item.tableid}>{item.tablename}</option>
                        )}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                      <input type="text" name="location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Location" />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-900">Url</label>
                      <input type="text" name="url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type Url" />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                      <textarea name="description" rows="2" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write description here"></textarea>                    
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div> 
        </>
      }
    </>
  );
}