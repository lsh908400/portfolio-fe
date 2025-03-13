import React from 'react';

interface IconSelectorProps {
    showIconBox: boolean;
    onIconSelect: (e: React.MouseEvent, icon: string) => void;
    onClose: () => void;
}


const iconItems = [
    {name : 'fa-solid fa-check'},
    {name : 'fa-solid fa-house'},
    {name : 'fa-solid fa-circle-user'},
    {name : 'fa-solid fa-image'},
    {name : 'fa-solid fa-file'},
    {name : 'fa-solid fa-camera'},
    {name : 'fa-solid fa-calendar'},
    {name : 'fa-solid fa-cloud'},
    {name : 'fa-solid fa-desktop'},
    {name : 'fa-solid fa-palette'},
    {name : 'fa-solid fa-truck'},
    {name : 'fa-solid fa-headphones'},
    {name : 'fa-solid fa-bell'},
    {name : 'fa-solid fa-user'},
    {name : 'fa-solid fa-comment'},
    {name : 'fa-solid fa-envelope'},
    {name : 'fa-solid fa-magnifying-glass'},
    {name : 'fa-solid fa-download'},
    {name : 'fa-solid fa-bars'},
    {name : 'fa-solid fa-users'},
    {name : 'fa-solid fa-phone'},
    {name : 'fa-solid fa-music'},
    {name : 'fa-solid fa-bomb'},
    {name : 'fa-solid fa-xmark'},
    {name : 'fa-solid fa-arrow-up'},
    {name : 'fa-solid fa-arrow-down'},
    {name : 'fa-solid fa-arrow-right'},
    {name : 'fa-solid fa-arrow-left'},
    {name : 'fa-solid fa-paperclip'},
    {name : 'fa-solid fa-clipboard'},
    {name : 'fa-solid fa-pen'},
    {name : 'fa-solid fa-umbrella'},
    {name : 'fa-solid fa-gift'},
    {name : 'fa-solid fa-list'},
    {name : 'fa-solid fa-trash'},
    {name : 'fa-solid fa-lock'},
    {name : 'fa-solid fa-car'},
];

const IconSelector: React.FC<IconSelectorProps> = ({
    showIconBox,
    onIconSelect,
    onClose
}) => {


    if (!showIconBox) return null;

    return (
        <div className='icon_box absolute top-3 left-8 !border-black border w-[180px] h-[180px] bg-white !px-2 overflow-auto'>
            <div className='flex justify-between items-center'>
                <p>아이콘 선택</p>
                <i 
                    onClick={onClose} 
                    className='fa-solid fa-xmark cursor-pointer'
                ></i>
            </div>
            <div className='flex flex-wrap'>
                    {iconItems.map((item) => (
                    <span 
                        onClick={(e) => onIconSelect(e, item.name)}
                        key={item.name} 
                        className='w-[20px] h-[20px] border flex items-center justify-center'
                    >
                        <i className={`${item.name} cursor-pointer`}></i>
                    </span>
                    ))}
            </div>
        </div>
    );
};

export default IconSelector;