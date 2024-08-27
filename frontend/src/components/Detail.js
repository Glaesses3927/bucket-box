import React from 'react';

export default function Detail({ item, today }) {
  if(item){
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <div>
          <div className='relative'>
            <h2 className='font-bold text-lg relative mb-6 pr-16 after:absolute after:left-0 after:w-full after:-bottom-3 after:h-[2px] after:bg-gray-300'>
              {item.title ? item.title : "NoTitle"}
            </h2>
            {item.completed===1 &&
              <div className='absolute right-0 top-0'>
                <svg className="w-[32px] h-[32px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
            }{item.completed===0 && item.due_date.replace(/-/g,'') < today &&
              <div className='absolute right-0 top-0'>
                <svg className="w-[32px] h-[32px] text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
            }
          </div>
          <div className="relative font-noto px-4 py-2 my-2 mb-4 before:absolute before:w-1 before:h-full before:left-1 before:top-0 before:bg-gray-300">
            {item.description ? item.description : "NoDescription"}
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            {item.due_date}
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"/>
            </svg>
            {item.location ? item.location : "NoLocation"}
          </div>
          <div className='flex items-center mt-4'>
            <svg className="w-[28px] h-[28px] text-gray-800 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
            </svg>
            {item.url ? item.url : "NoURL"}
          </div>
        </div>
      </div>
    );
		// <div className="inline-block font-extralight text-sm mr-2 px-3 py-1 rounded-full text-white bg-gray-500">Room</div>
  } else {
    return (
      <div className="w-96 max-[480px]:w-80 p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        No item selected.
      </div>
    );
  }
}