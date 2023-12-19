import React, { useContext } from 'react';

import { useMediaQuery } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon, BellIcon, UserIcon } from '@heroicons/react/outline';

import Context from '../context';
import logo from '../assets/images/logo-app.png';
import menuItem from '../navigation/menu-item';
import { findTree } from '../utils/navigation-utils';
// import { ReactComponent as Wave } from '../assets/styles/wave.svg';
import HamburgerMenu from '../assets/images/hamburger-icon.svg';

function Header() {
  const { store } = useContext(Context);
  const location = useLocation();
  const [isLarge] = useMediaQuery('(min-width: 1224px)');

  return (
    <header className={`${isLarge ? 'p-4' : 'p-2'} flex p-5 border-b bg-[#fff] drop-shadow-sm`}>
      {isLarge ? (
        <div className="mx-3 cursor-pointer" onClick={() => store.toggleDrawer()}>
          <img src={logo} alt="logo" width={200} />
        </div>
      ) : (
        <div className="mx-1 h-8 cursor-pointer" onClick={() => store.toggleDrawer()}>
          <img src={HamburgerMenu} alt="hamburger-icon" className="h-8" />
        </div>
      )}
      <ul className="flex pl-20 gap-8 flex-auto items-center">
        {menuItem
          .filter(item => item.showmenu)
          .map((v, i) => {
            if (v.routes && !isShouldDisplay(v.routes)) return null;
            return (
              <li className="px-2" key={i}>
                <Link
                  to={v.route}
                  className={
                    findTree([v], location).length > 0
                      ? 'text-[#1BB4C0] px-4 py-1 bg-[#E9E9E9] bg-opacity-75 rounded-md'
                      : ''
                  }
                >
                  {v.displayName}
                </Link>
              </li>
            );
          })}
      </ul>
      <div className="flex">
        <div className="flex items-center justify-center mx-4">
          <BellIcon className="w-5 h-5 mx-4 text-[#757575]" />
          <UserIcon className="w-5 h-5 text-[#757575]" />
          <ChevronDownIcon className="w-4 h-4 text-[#757575]" />
        </div>
      </div>
      {/* <Wave /> */}
    </header>
  );
}

const isShouldDisplay = routes => {
  let shouldDisplay = false;
  if (!routes) return false;

  // we make sure the parent has at least one displayed child
  routes.forEach(v => {
    if (!shouldDisplay) {
      //   if (v.showmenu && !v.routes && AuthService.hasRole('mofids_pds', `${v.role}${v.exactRole ? '' : '_access'}`)) {
      if (v.showmenu && (!v.routes || v.route)) {
        shouldDisplay = true;
      } else {
        shouldDisplay = isShouldDisplay(v.routes);
      }
    }
  });

  return shouldDisplay;
};

export default Header;
export { isShouldDisplay };
