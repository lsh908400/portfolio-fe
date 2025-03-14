import React from 'react';
import { ChromePicker } from 'react-color';
import { BlockData } from '../../types';



interface CommonColorPickerProps {
    color?: string;
    onChange?: (color: string) => void;
    onClick?: (e:React.MouseEvent) => void;
    showPicker?: boolean,
    setShowPicker : any,
    changeBlockColor : (color : string, block : BlockData) => void
    block : BlockData;
}
  
    const CommonColorPicker: React.FC<CommonColorPickerProps> = ({
        color,
        onClick,
        showPicker,
        setShowPicker,
        changeBlockColor,
        block
    }) => {
        const handleClose = () => {
        setShowPicker(false);
        };
    
        const handleChange = (color: any, block : BlockData) => {
            changeBlockColor(color.hex,block);
        };
    
        return (
        <div
            className="w-[18px] h-[18px] rounded cursor-pointer relative"
            style={{ backgroundColor: color || '#000000' }}
            onClick={onClick}
        >
            {showPicker && (
            <div className="absolute z-50" style={{ top: '30px', left: '0' }}>
                <div
                className="fixed inset-0"
                onClick={handleClose}
                />
                <ChromePicker
                color={color}
                onChange={(newColor)=>handleChange(newColor,block)}
                disableAlpha={true}
                />
            </div>
            )}
        </div>
        );
    };

export default CommonColorPicker;