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

import logo_react from './lib/logo_react.svg';
import logo_redux from './lib/logo_redux.svg';
import logo_tailwind from './lib/logo_tailwindcss.svg';
import logo_auth0 from './lib/logo_auth0.svg';
import logo_nodejs from './lib/logo_nodejs.svg';
import logo_flowbite from './lib/logo_flowbite.svg';
import back_video from './lib/mixkit-blonde-woman-reading-a-book-4948-hd-ready.mp4';
import illust_forgot from './lib/illust_forgot.svg';
import illust_share from './lib/illust_share.svg';
import pic_photo from './lib/pic_photo.jpg';
import pic_montain from './lib/pic_montain.jpg';

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
  const { loginWithRedirect } = useAuth0();
  if(mode==="loading") {
    return(
      <div className='h-screen flex flex-col justify-center items-center bg-gray-100'>
        <div>
          <svg aria-hidden="true" role="status" className="w-8 h-8 mx-auto animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
        </div>
        <div className='mt-4 font-noto font-xl font-bold'>Loading...</div>
      </div>
    );
  }
  else if(mode==="notlogin"){
    return(
      <div className='bg-gray-100 pb-6 font-noto'>
        <section className='relative h-screen z-10'>
          <div className='absolute h-screen inset-0 overflow-hidden'>
            <video className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 min-h-full min-w-full max-w-none' playsInline muted autoPlay loop>
              <source src={back_video} type="video/mp4" />
              <p>動画を再生できる環境ではありません。</p>
            </video>
            <div className='absolute top-0 left-0 w-screen h-screen bg-[rgb(0,0,0,0.5)]'></div>
          </div>
          <div className='relative pt-48 pl-4 min-[900px]:pl-10 text-white'>
            <h2 className='font-bold text-6xl min-[900px]:text-8xl leading-tight font-serif mb-16'>人生に、<br/>ゴールを。</h2>
            <p className='mb-6 text-lg sm:text-xl font-semibold'>BucketBoxで、<br className='sm:hidden'/>やりたいことリストを作成しましょう。</p>
            <button className='bg-blue-500 hover:bg-blue-600 py-3 px-6 ml-2 rounded-lg font-bold' onClick={() => loginWithRedirect({ audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}` })}>ログインはこちら</button>
          </div>
        </section>
        <section className='relative overflow-hidden'>
          <div className='absolute -right-16 -top-4 -right-28 md:-top-16 md:-right-28 lg:-top-32 lg:-right-52 w-[200px] h-[200px] md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] overflow-hidden rounded-full'>
            <img className='absolute top-0 left-0 h-full max-w-none' src={pic_montain} alt='Mountain Climber'></img>
            <div className='absolute top-0 left-0 h-full w-full bg-[rgb(243,244,246,0.8)]'></div>
          </div>
          <div className='absolute top-[450px] -left-12 lg:top-96 lg:-left-28 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full'>
            <img className='absolute top-0 left-0 h-full max-w-none' src={pic_photo} alt='Mountain Climber'></img>
            <div className='absolute top-0 left-0 h-full w-full bg-[rgb(243,244,246,0.8)]'></div>
          </div>
          <section className='flex flex-col items-center max-w-[600px] mx-3 min-[600px]:mx-auto pt-24 pb-20 relative z-10'>
            <div className='flex items-center mx-auto mb-6'>
              <div className='h-1 w-16 bg-gray-400'></div>
              <h3 className='font-bold text-gray-500 mx-5 text-xl'>BucketBoxとは?</h3>
              <div className='h-1 w-16 bg-gray-400'></div>
            </div>
            <div className='text-center font-medium'>
              <p className='mb-2'>BucketBoxは、<br className='sm:hidden'/>生きている間にやりたいことリストを<br/>作成・管理するWebアプリです。</p>
              <p className='mb-2'>死を意味する俗語 "kick the bucket" から、<br/> "bucket list" は “死ぬまでにやりたいことリスト” を意味するようになりました。</p>
              <p>いつ終わるかわからない人生に、<br className='sm:hidden'/>もう残りわずかな人生に、 <br/>ゴールをたててみませんか?</p>
            </div>
          </section>
          <section className="max-w-[900px] p-8 mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold leading-tight">Features</h2>
              <p className="mt-1 text-gray-600">BucketBoxでは、<br className='sm:hidden'/>こんなことができちゃいます。</p>
            </div>
            <div className="grid min-[900px]:grid-cols-3 gap-6 bg-gray-100">
              <div className="flex flex-col border-2 border-gray-300 rounded-xl p-6">
                <h3 className='font-bold'><div className='text-lg'>忘れそうになったこと、</div><div className='text-3xl text-end'>ありませんか?</div></h3>
                <div className="my-3">
                  <img className='h-[140px] mx-auto' src={illust_forgot} alt="Illust forot" />
                </div>
                <p className="text-gray-800">
                  BucketBoxなら、あなたのポケットに入っているスマートフォンで、いつでもどこでも確認できます。
                </p>
              </div>
              <div className="flex flex-col border-2 border-gray-300 rounded-xl p-6">
                <h3 className='font-bold'><div className='text-base'>シェアしたいと思ったこと、</div><div className='text-3xl text-end'>ありませんか?</div></h3>
                <div className="my-3">
                  <img className='h-[140px] mx-auto' src={illust_share} alt="Illust share" />
                </div>
                <p className="text-gray-800">
                  BucketBoxなら、あなたの家族や親友とやりたいことリストを簡単にシェアできます。
                </p>
              </div>
              <div className="flex flex-col p-6">
                <h3 className='font-bold'><div className='text-lg'>そのほか、</div><div className='text-3xl text-end'>いろいろ。</div></h3>
                <div className="my-3">
                  <svg className="w-[140px] h-[140px] mx-auto text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                  </svg>
                </div>
                <p className="text-gray-800">
                  BucketBoxなら、あなたが欲しい機能を開発者にそっと言うだけで、開発者ががんばります。しかも無料。
                </p>
              </div>
            </div>
          </section>
          <section className='flex justify-center pt-20 pb-12'>
            <button className='font-medium bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 py-3 px-6 ml-2 rounded-lg text-white flex items-center' onClick={() => loginWithRedirect({ audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}` })}>
              さぁ、はじめよう
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
          </section>
          <section className='flex flex-col items-center py-12'>
            <div className='flex items-center mx-auto mb-6'>
              <div className='h-px w-16 bg-gray-400'></div>
              <h3 className='font-bold text-gray-500 mx-5'>CREATED WITH</h3>
              <div className='h-px w-16 bg-gray-400'></div>
            </div>
            <div className='flex gap-4 justify-center'>
              <img src={logo_react} className='h-8 w-8' alt='reactlogo'></img>
              <img src={logo_redux} className='h-8 w-8' alt='reduxlogo'></img>
              <img src={logo_tailwind} className='h-8 w-8' alt='tailwindcsslogo'></img>
              <img src={logo_flowbite} className='h-8 w-8' alt='flowbitelogo'></img>
              <img src={logo_auth0} className='h-8 w-8' alt='auth0logo'></img>
              <img src={logo_nodejs} className='h-8 w-8' alt='nodejslogo'></img>
            </div>
          </section>
        </section>
      </div>
    );
  }
}

function Footer() {
  return(
    <>
      <footer className='text-center w-full bg-white'>
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
