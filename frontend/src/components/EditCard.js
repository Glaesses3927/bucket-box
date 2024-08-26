import React from 'react';
import { useDispatch } from 'react-redux';
import { setEditting } from '../store/showSlice';
import { setBucketList } from '../store/targetSlice';

export default function EditCard({ item }) {
  const dispatch = useDispatch();
  function Edit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const due_date = form.get("due_date") || "";
    const location = form.get("location") || "";
    const url = form.get("url") || "";
    const newitem = { id: item.id, title: title, description: description, due_date: due_date, location: location, url: url, completed: item.completed};
    fetch(process.env.REACT_APP_API_PATH + "/test", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newitem)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success:', data);
      fetch(process.env.REACT_APP_API_PATH + "/test?_=" + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if(!Array.isArray(data)) dispatch(setBucketList([data]));
        else dispatch(setBucketList(data));
      }).catch(err => {
        console.error(err)
      });
    }).catch(err => console.error('Error:', err));  
    dispatch(setEditting(false));
  }

  if(item){
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <form id="editForm" onSubmit={Edit}>
          <div className='relative'>
            <h2 className='font-bold text-lg relative mb-6 after:absolute after:left-0 after:w-full after:-bottom-3 after:h-[2px] after:bg-gray-300'>
              <input type="text" name="title" defaultValue={item.title} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type Title" required="" />
            </h2>
          </div>
          <div className="relative font-noto px-4 py-2 my-2 mb-4 before:absolute before:w-1 before:h-full before:left-1 before:top-0 before:bg-gray-300">
            <textarea name="description" defaultValue={item.description} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write description here"></textarea>
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <input type="date" name="due_date" defaultValue={item.due_date} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"/>
            </svg>
            <input type="text" name="location" defaultValue={item.location} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Location" />
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
            </svg>
            <input type="text" name="url" defaultValue={item.url} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="URL" />
          </div>
        </form>
      </div>
    );
		// <div class="inline-block font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Room</div>
  } else {
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        Details
      </div>
    );
  }
}