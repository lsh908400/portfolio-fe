import React from 'react'

interface CommonBtnProps {
    buttonName : string,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    className? : string
}
const CommonBtn : React.FC<CommonBtnProps> = ({buttonName , onClick , className}) => {
  return (
    <button
        className={`text-[0.8em] box-shadow bg-white text-gray-500 cursor-pointer hover:text-white hover:bg-blue-400 rounded-xl w-14 h-6 flex items-center justify-center ${className ? className : ''}`}
        onClick={(e) => onClick ? onClick(e) : undefined}
    >
      {buttonName}
    </button>
  )
}

export default CommonBtn;