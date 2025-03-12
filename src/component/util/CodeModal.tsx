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
  content: string | Array<{name: string, content: string}>;
  language: string;
  onUpdate?: (content: string) => void;
  page: string;
}

const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  language,
  page,
}) => {
  const [editableContent, setEditableContent] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentArray, setContentArray] = useState<Array<{name: string, content: string}>>([]);
  
  // 초기 설정
  useEffect(() => {
    if (isOpen) {
      if (Array.isArray(content)) {
        setContentArray(content);
        setEditableContent(content[0]?.content || '');
      } else {
        setContentArray([{ name: title, content: content || '' }]);
        setEditableContent(content || '');
      }
      setCurrentIndex(0);
    }
  }, [isOpen, content, title]);

  // Prism 하이라이팅
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        Prism.highlightAll();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, editableContent, currentIndex]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableContent);
    alert('코드가 클립보드에 복사되었습니다!');
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setEditableContent(contentArray[currentIndex - 1]?.content || '');
    }
  };

  const goToNext = () => {
    if (currentIndex < contentArray.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setEditableContent(contentArray[currentIndex + 1]?.content || '');
    }
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
  const currentTitle = Array.isArray(contentArray) && contentArray.length > 0 
    ? `${title} - ${contentArray[currentIndex]?.name || ''}` 
    : title;
  const isMultipleContent = contentArray.length > 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="code_modal bg-white rounded-lg p-6 !pt-0 !pb-0 w-2/3 max-h-[80vh] overflow-scroll scrollbar-none">
        <div className="flex justify-between items-center pb-4 sticky top-0 left-0 z-50 bg-white !pt-6">
          <h2 className="text-xl font-bold text-gray-800">{currentTitle}</h2>
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

        {isMultipleContent && (
          <div className="flex justify-between mb-4 sticky top-[67px] left-0 z-50 bg-white">
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {contentArray.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`px-3 py-1 rounded ${
                  currentIndex === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <i className="fa-solid fa-arrow-left mr-1"></i> 이전
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === contentArray.length - 1}
                className={`px-3 py-1 rounded ${
                  currentIndex === contentArray.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                다음 <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-auto">
          <pre className="line-numbers">
            <code className={`language-${prismLanguage}`}>{editableContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;