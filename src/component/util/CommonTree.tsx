import { TreeItemProps } from "../../types";

const CommonTree : React.FC<TreeItemProps> = ({ depth, state, text }) => {
  // 들여쓰기 클래스 생성
  const indentClass = depth > 0 ? `!ml-[${depth * 3}em]` : '';
  
  // 상태에 따라 접두사 결정
  let prefix = '';
  if (state === 'start') prefix = '├── ';
  else if (state === 'end') prefix = '└── ';
  else prefix = '│\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'; // middle 상태일 때
  
  return (
    <p className={indentClass}>
      {depth > 0 ? prefix : ''}{text}
    </p>
  );
};

export default CommonTree;