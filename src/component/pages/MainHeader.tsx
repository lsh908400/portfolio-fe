import React from 'react'

interface MainHeaderProps {
    title : string,
}

const MainHeader : React.FC<MainHeaderProps> =({title})=> {
  return (
    <div className='text-[15px] font-bold text-aside-primary !pl-[10px] !pt-[10px]'>
      {title}
    </div>
  )
}

export default MainHeader;