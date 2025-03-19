import React from 'react'

const HomeBEFE : React.FC = () => {
    return (
    <div className='text-start h-full'>
        <h2 className="text-2xl font-bold mb-4">StudyContent 컴포넌트의 아키텍처 구조</h2>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">1. 프레젠테이션 계층 (Presentation Layer)</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">프록시 패턴 구현</span>: 렌더링 로직 위임
                <ul className="list-circle pl-5 mt-1">
                <li>렌더링 책임을 <code className="bg-red-100 text-black px-1 rounded">Editor</code> 컴포넌트에 위임</li>
                <li>실제 에디터 UI와 로직을 캡슐화하여 분리</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">컨테이너 역할</span>: 데이터 전달 중개자
                <ul className="list-circle pl-5 mt-1">
                <li>부모 컴포넌트로부터 받은 <code className="bg-red-100 text-black px-1 rounded">editorInfo</code>와 <code className="bg-red-100 text-black px-1 rounded">setEditorInfo</code>를 자식 컴포넌트로 전달</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">2. 데이터 흐름 관리 (Data Flow)</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">단방향 데이터 흐름</span>: 상위에서 하위로 Props 전달
                <ul className="list-circle pl-5 mt-1">
                <li>부모로부터 받은 <code className="bg-red-100 text-black px-1 rounded">editorInfo</code> 객체를 통해 편집기 상태 관리</li>
                <li>상태 업데이트는 <code className="bg-red-100 text-black px-1 rounded">setEditorInfo</code> 함수를 통해 부모에게 위임</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">3. 컴포넌트 구성 (Component Structure)</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">래퍼(Wrapper) 패턴</span>: 레이아웃 및 스타일링 분리
                <ul className="list-circle pl-5 mt-1">
                <li>외부 레이아웃과 스크롤 관리</li>
                <li>내부 컴포넌트(<code className="bg-red-100 text-black px-1 rounded">Editor</code>)에게 콘텐츠 렌더링 위임</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">독립적 렌더링</span>: 효율적인 성능 최적화
                <ul className="list-circle pl-5 mt-1">
                <li><code className="bg-red-100 text-black px-1 rounded">key</code>를 통한 에디터 인스턴스 갱신 제어</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">4. 전체 아키텍처 흐름</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">마이크로 MVC 패턴</span>: 역할 분리 구현
                <ul className="list-circle pl-5 mt-1">
                <li><code className="bg-red-100 text-black px-1 rounded">StudyAside</code>: 네비게이션 컨트롤러 역할 (Controller)</li>
                <li><code className="bg-red-100 text-black px-1 rounded">editorInfo</code>: 데이터 모델 역할 (Model)</li>
                <li><code className="bg-red-100 text-black px-1 rounded">StudyContent/Editor</code>: 표시 및 편집 인터페이스 역할 (View)</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="bg-black p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-white">이 구조는 "프레젠테이션 위임 패턴"과 "컨테이너-프레젠터 패턴"의 특성을 결합하여, UI 렌더링과 데이터 관리를 효과적으로 분리합니다. 부모 컴포넌트가 데이터와 상태 관리를 담당하고, StudyContent는 단순히 이를 편집기에 전달하는 중개자 역할을 수행합니다. 이러한 구조는 유지보수성과 재사용성을 높이며, 복잡한 에디터 기능을 캡슐화하여 시스템의 다른 부분에 영향을 미치지 않도록 합니다.</p>
        </div>
    </div>
    )
}

export default HomeBEFE;
