import React from 'react';
import logo from '../logo.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setShowMenu } from "../store/showSlice.js";
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
  const dispatch = useDispatch();
  const showMenu = useSelector(state => state.show.showMenu);
  const { loginWithRedirect, logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const menus = [
    { name: 'Home', href: '../../' },
    { name: 'WebApps', href: '../' }
  ];
  const listMenus = menus.map((menu) => 
    <li className='flex sm:my-auto sm:ml-6 text-gray-900 rounded hover:bg-gray-100' key={menu.name}>
      <a className='p-2 w-full text-center' href={menu.href}>
        {menu.name}
      </a>
    </li>
  );

  let profile;
  if(isLoading) {
    profile = (
      <li className='flex mx-auto sm:my-auto sm:ml-6'>
        <button className="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-full text-sm px-4 py-2 text-center" disabled>
          Loading
        </button>
      </li>
    );
  } else if(isAuthenticated) {
    console.log(user);
    profile = (
      <>
      <li className='flex mx-auto sm:my-auto sm:ml-6'>
        <a className='' href='/'>
          <img className="w-[32px] h-[32px]" src={user.picture} alt={user.name} />
        </a>
      </li>
      <li className='flex mx-auto my-2 sm:my-auto sm:ml-6'>
        <button onClick={() => logout({ logoutParams: { returnTo: `${process.env.REACT_APP_REDIRECT_URI}` } })} className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center">
          LogOut
        </button>
      </li>
      </>
    );
    // <svg  lassName="w-[32px] h-[32px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    //   <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/>
    // </svg>
  } else {
    profile = (
      <li className='flex mx-auto sm:my-auto sm:ml-6'>
        <button onClick={() => loginWithRedirect({ audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}` })} className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center">
          LogIn
        </button>
      </li>
    );
  }
  
  return(
    <>
      <header className='flex p-3 pr-8 sm:pr-12 bg-white absolute top-0 w-full'>
        <div className='flex items-center'>
          <img src={logo} className='h-12 w-12' alt='logo'></img>
          <h1 className='text-lg leading-none'>Bucket Box</h1>
        </div>
        <ul className='max-[640px]:hidden flex ml-auto'>
          {listMenus}
          {profile}
        </ul>
        <button onClick={() => {dispatch(setShowMenu(!showMenu))}} type="button" className="z-20 sm:hidden ml-auto my-auto inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </header>
      <ul className={showMenu ? "z-10 absolute right-0 inset-y-0 flex flex-col p-4 pt-20 border border-gray-100 rounded-lg bg-gray-50" : "hidden"}>
        {profile}
        {listMenus}
      </ul>
    </>
  )
}