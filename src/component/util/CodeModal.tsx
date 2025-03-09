// components/CodeModal.tsx
import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
// 기본 테마
import 'prismjs/themes/prism-tomorrow.css';
// 추가 언어 지원
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
// 라인 넘버 플러그인
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
// 툴바 플러그인
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
// 복사 버튼 플러그인
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  language: string;
  onUpdate?: (content: string) => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  language,
}) => {
  const [editableContent, setEditableContent] = useState(content);
  
  useEffect(() => {
    // 모달이 열릴 때만 content를 editableContent에 설정
    if (isOpen) {
      setEditableContent(content);
    }
  }, [isOpen, content]);
  
  useEffect(() => {
    // 모달이 열려있고, 편집 모드가 아닐 때만 Prism 하이라이팅 실행
    if (isOpen) {
      // setTimeout을 사용하여 DOM이 완전히 렌더링된 후 Prism 실행
      const timer = setTimeout(() => {
        Prism.highlightAll();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableContent);
    alert('코드가 클립보드에 복사되었습니다!');
  };
  

  if (!isOpen) return null;

  // 언어에 따른 클래스 매핑
  const languageMap: Record<string, string> = {
    'HTML': 'markup',
    'API': 'javascript',
    'JS': 'javascript',
    'Front': 'jsx',
    'Back': 'javascript'
  };

  const prismLanguage = languageMap[language] || 'markup';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="code_modal bg-white rounded-lg p-6 w-2/3 max-h-[80vh] overflow-scroll scrollbar-none">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div>
            <button 
              onClick={copyToClipboard}
              className="text-blue-500 hover:text-blue-700 mr-3"
              title="복사하기"
            >
              <i className="fa-solid fa-copy"></i>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              title="닫기"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <pre className="line-numbers">
            <code className={`language-${prismLanguage}`}>{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;