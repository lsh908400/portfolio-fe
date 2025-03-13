import React from 'react';
import CommonModal from '../../../util/CommonModal';
import VariableInfo from '../../../util/VariableInfo';

interface PostBoardModalProps {
    isOpen : boolean;
    onClose : () => void;
    board : {
        postBoard : string,
        deleteBoard : (string|number)[],
    };
    changeHandler : (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    postKeyDownHandler : (e: React.KeyboardEvent) => void;
    postBoardHandler : () => void;
}

const PostBoardModal : React.FC<PostBoardModalProps> = ({ 
  isOpen, 
  onClose, 
  board, 
  changeHandler, 
  postKeyDownHandler, 
  postBoardHandler 
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Board"
      width="400px"
      height="300px"
      onConfirm={postBoardHandler}
      confirmButtonName="Post"
      cancelButtonName="Cancel"
    >
      <VariableInfo
        layout="vertical"
        className="font-bold text-[1em] !mt-[2em]"
        fields={[
          {
            type: 'input',
            label: '제목 :',
            onChange: changeHandler,
            onKeyDown: postKeyDownHandler,
            value: board.postBoard,
            className: 'board_title flex justify-between !mb-[10px] w-full',
          },
        ]}
      />
    </CommonModal>
  );
};

export default PostBoardModal;