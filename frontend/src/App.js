import './App.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

import AddModal from "./components/AddModal.js";
import Header from './components/Header.js';
import ListBucket from './components/ListBucket.js';
import Detail from './components/Detail.js';
import EditCard from './components/EditCard.js';
import Control from './components/Control.js';

import { setShowAddModal } from "./store/showSlice.js";
import { setBucketList } from './store/targetSlice.js';
import { setBucketTable } from './store/targetSlice.js';

const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = ('0' + (now.getMonth() + 1)).slice(-2);
const thisDay = ('0' + now.getDate()).slice(-2);
const today = thisYear + thisMonth + thisDay;
let token;


function Main() {
  const editting = useSelector(state => state.show.editting);
  const bucketList = useSelector(state => state.target.bucketList);
  const chosenItemId = useSelector(state => state.target.chosenItemId);
  const chosenItemTable = useSelector(state => state.target.chosenItemTable);
  const dispatch = useDispatch();

  return(
    <>
      <div className='flex bg-blue-100 min-h-screen pt-20 pb-6 max-[840px]:pt-28 max-[840px]:px-6'>
        <div className='flex max-[840px]:flex-col gap-2 items-center mx-auto'>
          <div>
            <ListBucket today={today}/>
          </div>
          <div className='flex flex-col gap-2'>
            { editting ?
              <EditCard item={bucketList.find(item => (item.id === chosenItemId) && (item.tableid === chosenItemTable))} />:
              <Detail item={bucketList.find(item => (item.id === chosenItemId) && (item.tableid === chosenItemTable))} today={today}/>
            }
            <Control />
          </div>
        </div>
      </div>
      <AddModal />
      <button className='fixed bottom-8 right-4' onClick={() => dispatch(setShowAddModal(true))}>
        <svg className="w-[48px] h-[48px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd"/>
        </svg>
      </button>
    </>
  );
}

function UnAuthMain({mode}) {
  let content;
  if(mode==="loading") {
    content = "Loading...";
  }
  else if(mode==="notlogin"){
    content = "Please LogIn using the button on the top right."
  }
  return(
    <div className='flex bg-blue-100 min-h-screen pt-20 pb-6 max-[840px]:pt-28 max-[840px]:px-6'>
      <div className='flex max-[840px]:flex-col gap-2 items-center mx-auto'>
        {content}
      </div>
    </div>
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
  const { isAuthenticated, isLoading } = useAuth0();
  if(isLoading) {
    return(<><Header/><UnAuthMain mode="loading"/><Footer/></>);
  } else if(isAuthenticated){
    return(<><Header/><Main/><Footer/></>);
  } else {
    return(<><Header/><UnAuthMain mode="notlogin"/><Footer/></>);
  }
  
}

export default function App() {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const fetcherr = new Error('[Error]: fetch');
        token = await getAccessTokenSilently();
        let res = await fetch(`${process.env.REACT_APP_API_PATH}/v1?_=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(!res.ok) throw fetcherr;
        let data = await res.json();
        dispatch(setBucketList(data));
        res = await fetch(`${process.env.REACT_APP_API_PATH}/v1/tables?_=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(!res.ok) throw fetcherr;
        data = await res.json();
        dispatch(setBucketTable(data));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [dispatch, getAccessTokenSilently]);
  return <Container />;
}
