import React, { useCallback } from 'react'

interface CardProps {
    props? : any;
    bgColor? : string;
    setContentPageSection : React.Dispatch<number>
}

const Card : React.FC<CardProps> = ({
    props,
    bgColor,
    setContentPageSection
}) => {
    const openProject = useCallback ((id:number)=> {
        setContentPageSection(id)
    },[])

    return (
        <section 
        style={{backgroundColor : bgColor}}
        onClick={()=>openProject(props.id)}
        className='w-[250px] h-[400px] rounded-md !p-2 cursor-pointer box-shadow hover:translate-x-1 hover:translate-y-1'
        >
            <span className='border border-b-0 border-black rounded-md rounded-b-none !px-1 font-bold'>{props.name}</span>
            <div className=' w-full h-[180px] !mt-[10px] rounded-sm'>
                <img className='w-full h-full flex justify-center items-center' src={`${import.meta.env.VITE_API_URL}/uploads/${props.img}`}></img>
            </div>
            <p className='text-gray-500 !mt-[10px]'>{props.desc}</p>
        </section>
    )
}

export default  Card;