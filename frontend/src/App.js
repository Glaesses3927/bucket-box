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

import { setShowAddModal, setIsLoading } from "./store/showSlice.js";
import { setBucketList, setBucketTable } from './store/targetSlice.js';

import logo_react from './logo_react.svg';
import logo_redux from './logo_redux.svg';
import logo_tailwind from './logo_tailwindcss.svg';
import logo_auth0 from './logo_auth0.svg';
import logo_nodejs from './logo_nodejs.svg';
import logo_flowbite from './logo_flowbite.svg';

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
  const { getAccessTokenSilently } = useAuth0();

  async function fetchLatestData() {
    try {
      const fetcherr = new Error('[Error]: fetch');
      token = await getAccessTokenSilently();
      dispatch(setIsLoading(true));
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
      alert(err);
    }
    dispatch(setIsLoading(false));
  }

  return(
    <>
      <div className='flex relative bg-blue-100 min-h-screen pt-20 pb-20 max-[840px]:pt-28 max-[840px]:px-6'>
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
        <div className='flex absolute gap-4 bottom-8 max-[840px]:bottom-4 inset-x-0 justify-center'>
          <img src={logo_react} className='h-8 w-8' alt='reactlogo'></img>
          <img src={logo_redux} className='h-8 w-8' alt='reduxlogo'></img>
          <img src={logo_tailwind} className='h-8 w-8' alt='tailwindcsslogo'></img>
          <img src={logo_flowbite} className='h-8 w-8' alt='flowbitelogo'></img>
          <img src={logo_auth0} className='h-8 w-8' alt='auth0logo'></img>
          <img src={logo_nodejs} className='h-8 w-8' alt='nodejslogo'></img>
        </div>
      </div>
      <AddModal />
      <button className='w-[48px] h-[48px] fixed bottom-24 right-4' onClick={() => fetchLatestData()}>
        <div className='w-[40px] h-[40px] m-auto flex rounded-full bg-gray-800'>
          <svg className="w-[36px] h-[36px] m-auto text-blue-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
          </svg>
        </div>
      </button>
      <button className='fixed bottom-12 right-4' onClick={() => dispatch(setShowAddModal(true))}>
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
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        if(isAuthenticated) {
          const fetcherr = new Error('[Error]: fetch');
          token = await getAccessTokenSilently();
          dispatch(setIsLoading(true));
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
        }
      } catch (err) {
        console.error(err);
        alert(err);
      }
      dispatch(setIsLoading(false));
    })();
  }, [dispatch, getAccessTokenSilently, isAuthenticated]);
  return <Container />;
}
