import './App.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AddModal from "./components/AddModal.js";
import Header from './components/Header.js';
import ListBucket from './components/ListBucket.js';
import Detail from './components/Detail.js';
import EditCard from './components/EditCard.js';
import Operation from './components/Operation.js';

import { setShowAddModal } from "./store/showSlice.js";
import { setBucketList } from './store/targetSlice.js';

const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = ('0' + (now.getMonth() + 1)).slice(-2);
const thisDay = ('0' + now.getDate()).slice(-2);
const today = thisYear + thisMonth + thisDay;


function Main() {
  const editting = useSelector(state => state.show.editting);
  const bucketList = useSelector(state => state.target.bucketList);
  const chosenItem = useSelector(state => state.target.chosenItem);
  const dispatch = useDispatch();

  function addItem(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const due_date = form.get("due_date") || "";
    const location = form.get("location") || "";
    const url = form.get("url") || "";
    const newitem = { title: title, description: description, due_date: due_date, location: location, url: url, completed: 0};
    fetch(process.env.REACT_APP_API_PATH + "/test", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newitem)
    })
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));
    dispatch(setShowAddModal(false));
  };

  return(
    <>
      <div className='flex bg-blue-100 min-h-screen pt-20 pb-6 max-[840px]:pt-28 max-[840px]:px-6'>
        <div className='flex max-[840px]:flex-col gap-2 items-center mx-auto'>
          <div>
            <ListBucket today={today}/>
          </div>
          <div className='flex flex-col gap-2'>
            { editting ?
              <EditCard item={bucketList.find(item => item.id === chosenItem)} />:
              <Detail item={bucketList.find(item => item.id === chosenItem)} today={today}/>
            }
            <Operation />
          </div>
        </div>
      </div>
      <AddModal addItem={addItem}/>
      <button className='fixed bottom-8 right-4' onClick={() => dispatch(setShowAddModal(true))}>
        <svg className="w-[48px] h-[48px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd"/>
        </svg>
      </button>
    </>
  );
}

function Footer() {
  return(
    <>
      <footer className='text-center min-[840px]:absolute bottom-0 w-full bg-white'>
        <small>© {thisYear} Glaesses All rights Reserved.</small>
      </footer>
    </>
  );
}

function Container() {
  return(
    <>
      <Header/>
      <Main/>
      <Footer/>
    </>
  );
}

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(process.env.REACT_APP_API_PATH + "/test")
    .then(res => res.json())
    .then(data => {
      if(!Array.isArray(data)) dispatch(setBucketList([data]));
      else dispatch(setBucketList(data));
    }).catch(err => {
      console.error(err)
    });
  });

  return <Container />;
}
