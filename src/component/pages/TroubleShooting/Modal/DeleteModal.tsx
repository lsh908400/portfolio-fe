// DeleteBoardModal.jsx
import React from 'react';
import CommonModal from '../../../util/CommonModal';

interface DeleteBoardModalProps {
    isOpen : boolean;
    onClose : () => void;
    deleteBoardHandler : () => void;
}

const DeleteBoardModal : React.FC<DeleteBoardModalProps> = ({ isOpen, onClose, deleteBoardHandler }) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Board"
      width="400px"
      height="200px"
      onConfirm={deleteBoardHandler}
      confirmButtonName="Delete"
      cancelButtonName="Cancel"
    >
      <div className="font-sans h-[100px] flex items-center">
        정말 삭제하시겠습니까?
      </div>
    </CommonModal>
  );
};

export default DeleteBoardModal;