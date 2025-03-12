import React from 'react';
import useClickHandler from '../../hooks/useClickHandler';
import { useNavigate } from 'react-router-dom';
import { useAsideStateStore } from '../../zustand/useStroe';


interface AsideProps {
  
}

const Aside: React.FC<AsideProps> = React.memo(({}) => {
  const navigation = useNavigate();
  const {isAsideCollapsed , inactive } = useAsideStateStore(); 
  const domRef = document.getElementById('aside');
  const handleClick = useClickHandler((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const bIsClickedNavIntroduce = target.classList.contains('nav_menu_type_introduce')
    const bIsClickedNavProfile = target.classList.contains('nav_sub_menu_type_profile')

    const bIsClickedNavFrontEnd = target.classList.contains('nav_menu_type_front_end')

    const bIsClickedNavBackEnd = target.classList.contains('nav_menu_type_back_end')

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
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      }
      case bIsClickedNavProfile :
      {
        target.classList.add('active')
        navigation('/profile')
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
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
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
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
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
          subMenu?.classList.add('active')
          setTimeout(() => {
            subMenu?.classList.remove('none')
          }, 500);
        }
        break;
      } 
      case bIsClickedNavTrouble :
      {
        console.log(target)
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
      <section id='info_section' className='flex justify-start gap-[10px] text-aside-primary !mt-[40px] text-[11px] font-bold !px-[20px]'>
        <article className='w-[50px] h-[50px] flex justify-center rounded-[10px] items-center'>
            <i className="fa-solid fa-user text-[20px]"></i>
        </article>
        <article className='flex gap-[5px] justify-start flex-col'>
          <div className='text-[15px] flex items-center'>-</div>
          <div className='text-[12px]'>
          -
          </div>
        </article>
        
      </section>
      <section id='nav' className='!mt-[80px] !p-[10px] text-aside-primary w-full flex flex-col gap-[30px] !py-[50px] border-b border-t'>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_introduce font-bold bg-header-primary-hover rounded-[5px] cursor-pointer text-nowrap'>• Introduce</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_introduce flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_profile'>• Profile</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_typescript'>• TypeScript</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_vanila'>• Vanila Js</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_memory'>• Memory</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_mini_project'>• Mini Project</li>
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_front_end font-bold bg-header-primary-hover rounded-[5px] cursor-pointer'>• FrontEnd</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_front_end flex flex-col gap-[5px]'>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_react'>• React</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_typescript'>• TypeScript</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_vanila'>• Vanila Js</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_memory'>• Memory</li>
              <li onClick={handleClick} className='nav_sub_menu bg-header-primary-hover cursor-pointer border-b nav_sub_menu_type_mini_project'>• Mini Project</li>
            </ul>
          </ul>
        </nav>
        <nav className='w-full'>
          <ul className='w-full'>
            <li onClick={handleClick} className='nav_menu_type_back_end font-bold bg-header-primary-hover rounded-[5px] cursor-pointer'>• BackEnd</li>
            <ul className='w-full h-auto !p-[5px] none nav_sub_menu_type nav_sub_menu_type_back_end flex flex-col gap-[5px]'>
              <li className='bg-header-primary-hover cursor-pointer border-b'>Type1</li>
              <li className='bg-header-primary-hover cursor-pointer border-b'>Type2</li>
              <li className='bg-header-primary-hover cursor-pointer border-b'>Type3</li>
              <li className='bg-header-primary-hover cursor-pointer border-b'>Type4</li>
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
        
      </section>
    </aside>
  );
});

export default Aside;