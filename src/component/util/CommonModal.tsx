// ModalComponent.jsx
import React from 'react';
import CommonBtn from './CommonBtn';

interface CommonModalProps {
    isOpen : boolean
    onClose : () => void;
    title : string,
    width? : string,
    height? : string,
    onConfirm : () => void;
    confirmButtonName? : string;
    cancelButtonName? : string;
    children : any;
    className? : string;
}

const CommonModal : React.FC<CommonModalProps> = ({
  isOpen,
  onClose,
  title,
  width = '400px',
  height = '300px',
  onConfirm,
  confirmButtonName = 'Confirm',
  cancelButtonName = 'Cancel',
  className,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 bg-black">
      <div className={`w-[${width}] h-[${height}] bg-white rounded-lg !p-6 flex flex-col ${className ? className : ''}`}>
        <div className="modal_title text-[1.5em] font-bold">{title}</div>
        <div className="flex-grow">
          {children}
        </div>
        <div className="modal_btn_box flex justify-end items-end gap-3">
          <CommonBtn
            buttonName={confirmButtonName}
            onClick={onConfirm}
          />
          <CommonBtn
            buttonName={cancelButtonName}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonModal;