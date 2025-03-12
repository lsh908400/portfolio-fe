import React from 'react';
import Header from '../component/layout/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../component/layout/Footer';
import Aside from '../component/layout/Aside';
import useClickHandler from '../hooks/useClickHandler';
import useVariableDomRef from '../hooks/useVariableDomRef';
import { useAsideStateStore } from '../zustand/useStroe';

const MainLayout: React.FC = () => {
  const { domRef } = useVariableDomRef('project');
  const {isAsideCollapsed , active , inactive } = useAsideStateStore(); 

  const handleClick = useClickHandler((e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
    const bIsClickedMenuBtnTarget = target.classList.contains('menu_btn_target')
    switch(true)
    {
      case bIsClickedMenuBtnTarget :
      {
        if(isAsideCollapsed)
        {
          inactive();
        }
        else 
        {
          active();
        }
        break;
      }
    }
  });

  return (
    <div onClick={handleClick} id="project" className="main_layout w-full h-screen flex flex-col">
        <Header 
          domRef={domRef}
        />
        <div className='flex-grow bg-white main_layout_content w-full h-content flex relative'>
            <Aside/>
            <main 
              className='main_content flex-grow h-content'>
                <Outlet />
            </main>
        </div>
        <Footer />
    </div>
  );
};

export default MainLayout;