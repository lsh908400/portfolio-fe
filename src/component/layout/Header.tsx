// components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useClickHandler from '../../hooks/useClickHandler';
import { useAsideStateStore } from '../../zustand/useStroe';
import { getPageCode, putPageCode } from '../../services/codeService';
import CodeModal from '../util/CodeModal';
import { CodeSnippet } from '../../types';

interface HeaderProps {
  domRef: any;
}

const Header: React.FC<HeaderProps> = ({ domRef }) => {
  const { isAsideCollapsed, active, inactive } = useAsideStateStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: '',
    language: ''
  });
  
  const [currentPageCode, setCurrentPageCode] = useState<CodeSnippet>({
    HTML: '',
    API: '',
    JS: '',
    Front: '',
    Back: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPageCode = async () => {
      setIsLoading(true);
      setError(null);
      
      try 
      {
        const pageName = location.pathname.split('/').pop() || 'index';
        const response = await getPageCode(pageName);
        
        if (response.success && response.data) {
          setCurrentPageCode(response.data);
        } else {
          // 데이터가 없는 경우 빈 객체로 초기화
          setCurrentPageCode({
            HTML: '',
            API: '',
            JS: '',
            Front: '',
            Back: ''
          });
        }
      } catch (err) {
        console.error('코드 데이터 가져오기 오류:', err);
        setError('코드 데이터를 가져오는 중 오류가 발생했습니다.');
        // 오류 발생 시 빈 객체로 초기화
        setCurrentPageCode({
          HTML: '',
          API: '',
          JS: '',
          Front: '',
          Back: ''
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageCode();
  }, [location.pathname]);
  
  const openCodeModal = (type: string) => {
    setModalContent({
      title: `${type} 코드`,
      content: currentPageCode[type as keyof CodeSnippet] || '코드를 불러올 수 없습니다.',
      language: type
    });
    setModalOpen(true);
  };
  
  const handleCodeUpdate = async (type: string, newContent: string) => {
    try {
      // 현재 페이지 코드 업데이트
      const updatedCode = { ...currentPageCode };
      updatedCode[type as keyof CodeSnippet] = newContent;
      setCurrentPageCode(updatedCode);
      
      // 백엔드에 업데이트
      const pageName = location.pathname.split('/').pop() || 'index';
      await putPageCode(pageName);
      
      alert('코드가 성공적으로 업데이트되었습니다.');
    } catch (err) {
      console.error('코드 업데이트 오류:', err);
      alert('코드 업데이트 중 오류가 발생했습니다.');
    }
  };
  
  const handleClick = useClickHandler ( async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetSection = target.closest('section');
    
    if (!targetSection) return;
    const bIsClickedHomeBtn = target.classList.contains('header_home_btn')
    const bIsClickedGetCodeBtn = target.classList.contains('get_code_btn')
    const bIsClickedPutCodeBtn = target.classList.contains('put_code_btn')

    switch(true)
    {
      case bIsClickedHomeBtn :
      {
        if (domRef.current === null || domRef.current === undefined) {
          return;
        }
        const allSubMenues: NodeListOf<HTMLUListElement> = domRef.current.querySelectorAll('.nav_sub_menu');
        for (let i = 0; i < allSubMenues.length; i++) 
        {
          allSubMenues[i].classList.remove('active');
        }
        navigate('/');
        inactive();
        break;
      }
      case bIsClickedGetCodeBtn :
      {
        const buttonText = targetSection.textContent?.trim();
        if (buttonText && ['HTML', 'API', 'JS', 'Front', 'Back'].includes(buttonText)) 
        {
          openCodeModal(buttonText);
        }
        break;
      }
      case bIsClickedPutCodeBtn :
      {
        try {
          setIsLoading(true);
          const pageName = location.pathname.split('/').pop() || 'index';
          const response = await putPageCode(pageName);
          
          if (response.success && response.data) 
          {
            setCurrentPageCode(response.data);
            alert('현재 페이지의 소스 코드를 성공적으로 가져왔습니다.');
          } 
          else 
          {
            alert('소스 코드를 가져오는데 실패했습니다.');
          }
        } catch (err) {
          console.error('소스 코드 가져오기 오류:', err);
          alert('소스 코드 가져오기 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
        break;
      }
    }
  })

  
  return (
    <>
      <header id="header" className='bg-header-primary w-full h-[30px] text-white flex'>
        <section id='header_menu_btn' className='menu_btn menu_btn_target cursor-pointer w-[30px] h-full flex justify-center items-center'>
          <i className="menu_btn_target fa-solid fa-bars w-[12px] h-[12px]"></i>
        </section>
        <section onClick={handleClick} id='header_home_btn' className='header_home_btn bg-header-primary-hover cursor-pointer w-[30px] h-full flex justify-center items-center'>
          <i className="header_home_btn fa-solid fa-house"></i>
        </section>
        <section onClick={handleClick} id='front_btn' className='get_code_btn bg-header-primary-hover cursor-pointer w-[70px] h-full flex justify-center items-center'>
          Front
        </section>
        <section onClick={handleClick} id='back_btn' className='get_code_btn bg-header-primary-hover cursor-pointer w-[70px] h-full flex justify-center items-center'>
          API
        </section>
        <section onClick={handleClick} id='back_btn' className='get_code_btn bg-header-primary-hover cursor-pointer w-[70px] h-full flex justify-center items-center'>
          Back
        </section>
        <section 
          onClick={handleClick} 
          className='put_code_btn bg-blue-600 hover:bg-blue-700 cursor-pointer w-[220px] h-full flex justify-center items-center ml-auto'
        >
          <i className="fa-solid fa-code mr-2"></i>
          코드 업데이트
        </section>
        
        {isLoading && (
          <section className='bg-blue-500 cursor-default w-[80px] h-full flex justify-center items-center'>
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            로딩중
          </section>
        )}
      </header>

      <CodeModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
        language={modalContent.language}
        onUpdate={(newContent) => handleCodeUpdate(modalContent.language, newContent)}
      />
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-1">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </>
  );
};

export default Header;