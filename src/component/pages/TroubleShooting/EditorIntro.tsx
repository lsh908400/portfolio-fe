import React from 'react'

const EditorIntro : React.FC = () => {
    return (
        <section className='editor_intro w-full h-full !p-10 !pb-0 box-border overflow-auto font-sans'>
            <div className='editor_title'>
                <p className='text-[2em] font-bold'>페이지 안내</p>
            </div>
            <div className='editor_intro_content !mt-16'>
                <div className='text-[1.2em] !mb-4 font-bold'>1. 구조</div>
                <div className='bg-code-black text-white text-code-primary font-bold !p-4 rounded-lg !mb-6'>
                    <p>TroubleShooting (페이지)</p>
                    <p>├── Aside (사이드 섹션)</p>
                    <p>└── MainContent (메인 콘텐츠 섹션)</p>
                    <p className='!ml-[3em]'>├── Default View</p>
                    <p className='!ml-[3em]'>├── Table View</p>
                    <p className='!ml-[6em]'>├── CommonTable</p>
                    <p className='!ml-[6em]'>└── Callback Function을 통해 테이블관리</p>
                    <p className='!ml-[3em]'>└── Editor</p>
                    <p className='!ml-[6em]'>└── useEditorBlocks (커스텀 훅)</p>
                    <p className='!ml-[12em]'>├── EditorOption(옵션관리모달)</p>
                    <p className='!ml-[12em]'>├── CommonColorPicker(색상변경)</p>
                    <p className='!ml-[12em]'>└── Menu(타입변경)</p>
                    <p className='!ml-[9em]'>├── 블록 관리 (추가/삭제/수정/order변경/리사이즈 등등)</p>
                    <p className='!ml-[9em]'>├── 블록 타입 변경</p>
                    <p className='!ml-[12em]'>└── 타입별 컴포넌트</p>
                    <p className='!ml-[9em]'>└── 블록 렌더링</p>
                </div>
                <div className='text-[1.2em] !mb-6 font-bold'>2. 데이터베이스 구조</div>
                <div className='bg-code-black text-white text-code-primary font-bold !p-4 rounded-lg !mb-6'>
                    <p>Category(Mysql)</p>
                    <p className='!ml-[3em]'>└──Board(Mysql)</p>
                    <p className='!ml-[6em]'>└──Block(Mongo)</p>
                </div>
                <div className='text-[1.2em] !mb-4 font-bold'>3. Aside</div>
                <ul className='!mb-6'>
                    <li>• 카테고리 CRUD</li>
                    <li>• pageSection, category-id 상태관리</li>
                </ul>
                <div className='text-[1.2em] !mb-6 font-bold'>4. Content</div>
                <ul className='!mb-6'>
                    <li>• pageSection별 뷰 랜더링</li>
                    <li>• Table 상태에서는 category-id별 게시판 구현</li>
                    <li>• Editor 상태에서는 커스텀 콜백을 통해서 블록 상태관리</li>
                </ul>
                <div className='text-[1.2em] !mb-6 font-bold'>5. 설계원칙</div>
                <ul className='!mb-6'>
                    <li>• 관심사 분리와 컴포넌트의 캡슐화</li>
                    <li>• 개방 폐쇄 원칙</li>
                    <li>• 유지, 보수, 확장의 용이성</li>
                    <li>• 오버엔지니어링 자제</li>
                </ul>
            </div>
        </section>
    )
}

export default  EditorIntro;