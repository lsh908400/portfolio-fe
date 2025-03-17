/**
 * 2025 03 03 - 이상훈
 * 1. navigation - useNavigate();
 * 2. zustand - Aside 상태변경
 * 3. useRef - Dom참조
 * 4. 공통클릭이벤트 - vanilajs를 자주 사용하던 입장에서 습관적으로 delegation과 돔참조를 활용하여 이벤트를 작성 수정예정
 */
import React from 'react';
import useClickHandler from '../../hooks/useClickHandler';
import { useNavigate } from 'react-router-dom';
import { useAsideStateStore } from '../../zustand/useStroe';


interface AsideProps {
  
}

const Aside: React.FC<AsideProps> = React.memo(({}) => {

  // 1. navigation - useNavigate();
  const navigation = useNavigate();


  // 2. zustand - Aside 상태변경
  const {isAsideCollapsed , inactive } = useAsideStateStore(); 


  // 3. useRef - Dom참조
  const domRef = document.getElementById('aside');


  // 4. 공통클릭이벤트 - vanilajs를 자주 사용하던 입장에서 습관적으로 delegation과 돔참조를 활용하여 이벤트를 작성 수정예정
  const handleClick = useClickHandler((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const bIsClickedNavIntroduce = target.classList.contains('nav_menu_type_introduce')
    const bIsClickedNavProfile = target.classList.contains('nav_sub_menu_type_profile')
    const bIsClickedNavPrev = target.classList.contains('nav_sub_menu_type_prev')
    const bIsClickedJob = target.classList.contains('nav_sub_menu_type_job')

    const bIsClickedNavFrontEnd = target.classList.contains('nav_menu_type_front_end')
    const bIsClickedReactInfo = target.classList.contains('nav_sub_menu_type_react')
    const bIsClickedVanilaInfo = target.classList.contains('nav_sub_menu_type_vanila')
    const bIsClickedFrontMini = target.classList.contains('nav_sub_menu_type_mini_project')
    const bIsClickedThymeLeaf = target.classList.contains('nav_sub_menu_type_thyme')

    const bIsClickedNavBackEnd = target.classList.contains('nav_menu_type_back_end')
    const bIsClickedSpringBoot = target.classList.contains('nav_sub_menu_type_spring_boot')
    const bIsClickedNodeJs = target.classList.contains('nav_sub_menu_type_node')

    const bIsClickedNavStudy = target.classList.contains('nav_menu_type_study')
    const bIsClickedNavTrouble = target.classList.contains('nav_sub_menu_type_trouble')

    switch(true)
    {
      case bIsClickedNavIntroduce :
      {
        const subMenu = domRef?.querySelector('.nav_sub_menu_type_introduce')
        if(subMenu === null || undefined)
        {
          return;
        }
        if(subMenu?.classList.contains('active'))
        {
          subMenu?.classList.add('none')
          subMenu?.classList.remove('active')
        }
        else
        {
          defaultSectionConvertFunction();
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      }
      case bIsClickedNavProfile :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/profile')
        inactive();
        break;
      } 
      case bIsClickedNavPrev :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/prevproject')
        inactive();
        break;
      } 
      case bIsClickedJob :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/job')
        inactive();
        break;
      } 
      case bIsClickedNavFrontEnd :
      {
        const subMenu = domRef?.querySelector('.nav_sub_menu_type_front_end')

        if(subMenu === null || undefined)
        {
          return;
        }
        if(subMenu?.classList.contains('active'))
        {
          subMenu?.classList.remove('active')
          subMenu?.classList.add('none')
        }
        else
        {
          defaultSectionConvertFunction();
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      }
      case bIsClickedReactInfo : 
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/study?type=2')
        inactive();
        break;
      }
      case bIsClickedVanilaInfo :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/study?type=3')
        inactive();
        break;
      }
      case bIsClickedThymeLeaf :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/study?type=6')
        inactive();
        break;
      }
      case bIsClickedFrontMini :
      {
        const allMenues = domRef?.querySelectorAll('.nav_sub_menu_type')
        allMenues?.forEach((v)=> {
            v.classList.add('none');
            v.classList.remove('active');
          })
        const allSubMenues = domRef?.querySelectorAll('.nav_sub_menu')
          allSubMenues?.forEach((v)=> {
            v.classList.remove('active');
        })
        target.classList.add('active')
        navigation('/mini?type=1')
        inactive();
        break;
      }
      
      case bIsClickedNavBackEnd :
      {
        const subMenu = domRef?.querySelector('.nav_sub_menu_type_back_end')

        if(subMenu === null || undefined)
        {
          return;
        }
        if(subMenu?.classList.contains('active'))
        {
          subMenu?.classList.remove('active')
          subMenu?.classList.add('none')
        }
        else
        {
          defaultSectionConvertFunction();
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      }
      case bIsClickedSpringBoot :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/study?type=4')
        inactive();
        break;
      }
      case bIsClickedNodeJs :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/study?type=5')
        inactive();
        break;
      }
      case bIsClickedNavStudy :
      {
        const subMenu = domRef?.querySelector('.nav_sub_menu_type_study')

        if(subMenu === null || undefined)
        {
          return;
        }
        if(subMenu?.classList.contains('active'))
        {
          subMenu?.classList.remove('active')
          subMenu?.classList.add('none')
        }
        else
        {
          defaultSectionConvertFunction();
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      } 
      case bIsClickedNavTrouble :
      {
        defaultSectionConvertSubFunction();
        target.classList.add('active')
        navigation('/trouble')
        inactive();
        break;
      }  
      default :
      {
        
        break;
      }
    }
    
    
  });

  const defaultSectionConvertSubFunction = () => {
    const allSubMenues = domRef?.querySelectorAll('.nav_sub_menu')
          allSubMenues?.forEach((v)=> {
            v.classList.remove('active');
    })
  }
  const defaultSectionConvertFunction = () => {
    const allMenues = domRef?.querySelectorAll('.nav_sub_menu_type')
        allMenues?.forEach((v)=> {
            v.classList.add('none');
            v.classList.remove('active');
    })
  }

  return (
    <aside 
          id="aside" 
          className='aside-overlay bg-aside-primary overflow-scroll'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
            width: '250px',
            transform: isAsideCollapsed ? 'translateX(0)' : 'translateX(-250px)',
            transition: 'transform 0.5s ease'
          }}
    >
      <section id='nav' className='!mt-[80px] !p-[10px] text-aside-primary w-full flex flex-col gap-[30px] !py-[50px] border-b border-t'>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_introduce font-bold bg-header-primary-hover rounded-[5px] cursor-pointer text-nowrap'>• Introduce</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_introduce flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_profile'>• Profile</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_prev'>• Prev-Project</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_job'>• Prev-Job-experience</li>
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_front_end font-bold bg-header-primary-hover rounded-[5px] cursor-pointer'>• FrontEnd</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_front_end flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_react'>• React</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_vanila'>• Vanila Js</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_thyme'>• ThymeLeaf</li>
              
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_back_end font-bold bg-header-primary-hover rounded-[5px] cursor-pointer'>• BackEnd</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_back_end flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_spring_boot'>Spring Boot</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_node'>Node Js</li>
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_study font-bold bg-header-primary-hover rounded-[5px] cursor-pointer'>• Study</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_study flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu nav_sub_menu_type_trouble bg-header-primary-hover cursor-pointer border-b'>• Troubleshooting</li>
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer nav_sub_menu_type_mini_project text-white'>• Mini Project</li>
          </ul>
        </nav>
        
      </section>
    </aside>
  );
});

export default Aside;