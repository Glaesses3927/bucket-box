import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowComp, setShowOver } from '../store/filterBoxSlice';
import { setEditting } from '../store/showSlice';
import { setChosenItemId } from '../store/targetSlice';
import { setChosenItemTable } from '../store/targetSlice';

export default function ListBucket({ today }) {
  const dispatch = useDispatch();
  const showComp = useSelector(state => state.filter.showComp);
  const showOver = useSelector(state => state.filter.showOver);
  const bucketList = useSelector(state => state.target.bucketList);

  const showlist = bucketList.filter(item => 
    (showComp || item.completed===0) && 
    (showOver || item.due_date.replace(/-/g,'') >= today || item.completed===1)
  );
  let listbucket;
  if(showlist.length===0){
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