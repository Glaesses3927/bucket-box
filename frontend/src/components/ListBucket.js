import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowComp, setShowOver } from '../store/filterBoxSlice.js';
import { setEditting } from '../store/showSlice.js';
import { setChosenItemId, setChosenItemTable } from '../store/targetSlice.js';

export default function ListBucket({ today }) {
  const dispatch = useDispatch();
  const showComp = useSelector(state => state.filter.showComp);
  const showOver = useSelector(state => state.filter.showOver);
  const bucketList = useSelector(state => state.target.bucketList);
  const isLoading = useSelector(state => state.show.isLoading);

  const showlist = bucketList.filter(item => 
    (showComp || item.completed===0) && 
    (showOver || item.due_date.replace(/-/g,'') >= today || item.completed===1)
  );

  let listbucket;
  if(isLoading) {
    listbucket = (
      <svg aria-hidden="true" role="status" className="w-8 h-8 mx-auto animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
    );
  } else if(showlist.length===0) {
    listbucket = "No item. Add item using the button on the buttom right.";
  } else {
    listbucket = showlist.map(item => 
      <li onClick={() => {dispatch(setChosenItemId(item.id));dispatch(setChosenItemTable(item.tableid));dispatch(setEditting(false));}} className='p-2 flex hover:bg-gray-100 hover:cursor-pointer' key={item.id + item.tableid}>
        <div>{item.title}</div>
        {item.completed===1 &&
        <div className='ml-auto'>
          <svg className="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </div>
        }{item.completed===0 && item.due_date.replace(/-/g,'') < today &&
        <div className='ml-auto'>
          <svg className="w-[24px] h-[24px] text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </div>
        }
      </li>
    );
  }
  return (
    <div className="w-96 max-[480px]:w-80 p-6 pt-4 bg-white border border-gray-200 rounded-lg shadow">
      <div className='flex mb-1'>
        <h2 className='font-bold text-lg my-auto'>BucketBox</h2>
        <div className='flex ml-auto'>
          <button onClick={() => dispatch(setShowComp(!showComp))} type="button" className="hover:bg-gray-100 rounded-full m-auto">
            { showComp ?
              <svg className="w-[32px] h-[32px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg> :
              <svg className="w-[32px] h-[32px] text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            }
          </button>
          <button onClick={() => dispatch(setShowOver(!showOver))} type="button" className="hover:bg-gray-100 rounded-full m-auto">
            { showOver ?
              <svg className="w-[32px] h-[32px] text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg> :
              <svg className="w-[32px] h-[32px] text-red-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            }
          </button>
        </div>
      </div>
      <ul className='divide-y'>
        {listbucket}
      </ul>
    </div>
  );
}