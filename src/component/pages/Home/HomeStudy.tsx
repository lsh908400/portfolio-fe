import React from 'react'

const HomeStudy :React.FC = () => {
    return (
    <div className='text-start h-full'>
        <h2 className="text-2xl font-bold mb-4">Study의 아키텍처 구조</h2>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">1. 계층화된 컴포넌트 구조</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">복합 컴포넌트 패턴</span>: 계층적 구성 구현
                <ul className="list-circle pl-5 mt-1">
                <li><code className="bg-red-100 text-black px-1 rounded">EditorAside</code>: 카테고리 관리 및 네비게이션</li>
                <li><code className="bg-red-100 text-black px-1 rounded">EditorTable</code>: 게시글 목록 및 CRUD 작업</li>
                <li><code className="bg-red-100 text-black px-1 rounded">Editor</code>: 실제 편집 기능 구현</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">모듈식 구조</span>: 확장성 고려한 설계
                <ul className="list-circle pl-5 mt-1">
                <li>독립적인 블록 시스템으로 다양한 콘텐츠 유형 지원</li>
                <li>컴포넌트 간 느슨한 결합을 통한 유지보수성 향상</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">2. 상태 관리 및 데이터 흐름</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">React Query 기반 데이터 관리</span>: 서버 상태 처리
                <ul className="list-circle pl-5 mt-1">
                <li>카테고리/게시판/블록 데이터의 효율적 캐싱 및 동기화</li>
                <li>낙관적 업데이트(Optimistic Updates)를 통한 사용자 경험 개선</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">계층적 상태 관리</span>: <code className="bg-red-100 text-black px-1 rounded">useState</code>와 <code className="bg-red-100 text-black px-1 rounded">useRef</code> 조합
                <ul className="list-circle pl-5 mt-1">
                <li>지역 UI 상태는 <code className="bg-red-100 text-black px-1 rounded">useState</code>로 관리</li>
                <li>참조 값과 최신 데이터는 <code className="bg-red-100 text-black px-1 rounded">useRef</code>로 추적</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">3. 커스텀 훅 시스템</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">비즈니스 로직 추상화</span>: 재사용 가능한 로직 분리
                <ul className="list-circle pl-5 mt-1">
                <li><code className="bg-red-100 text-black px-1 rounded">useEditorBlocks</code>: 블록 관리 핵심 로직 캡슐화</li>
                <li>CRUD 작업을 <code className="bg-red-100 text-black px-1 rounded">useMutation</code> 훅으로 캡슐화</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">콜백 기반 이벤트 처리</span>: 이벤트 핸들링 추상화
                <ul className="list-circle pl-5 mt-1">
                <li>블록 수정, 추가, 삭제에 대한 일관된 인터페이스 제공</li>
                <li>자동 저장 메커니즘을 통한 데이터 무결성 보장</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">4. 데이터베이스 통합 아키텍처</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">폴리글랏 퍼시스턴스</span>: 다중 데이터베이스 활용
                <ul className="list-circle pl-5 mt-1">
                <li>구조화된 데이터(카테고리, 게시판)는 <code className="bg-red-100 text-black px-1 rounded">MySQL</code>에 저장</li>
                <li>유연한 블록 데이터는 <code className="bg-red-100 text-black px-1 rounded">MongoDB</code>에 저장</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">서비스 계층 추상화</span>: API 호출 로직 분리
                <ul className="list-circle pl-5 mt-1">
                <li>서비스별 모듈화된 API 클라이언트 (<code className="bg-red-100 text-black px-1 rounded">blockService</code>, <code className="bg-red-100 text-black px-1 rounded">boardService</code> 등)</li>
                <li>일관된 응답 형식과 오류 처리 메커니즘</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">5. 사용자 인터페이스 설계</h3>
            <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-medium">모달 기반 상호작용</span>: 집중된 작업 흐름
                <ul className="list-circle pl-5 mt-1">
                <li>게시판 등록/삭제를 위한 전용 모달 컴포넌트</li>
                <li>에디터 옵션 관리를 위한 컨텍스트 메뉴</li>
                </ul>
            </li>
            <li>
                <span className="font-medium">상태 기반 UI 렌더링</span>: 직관적인 사용자 경험
                <ul className="list-circle pl-5 mt-1">
                <li>로딩/에러/데이터 상태에 따른 UI 분기 처리</li>
                <li>비동기 작업 상태 표시를 통한 사용자 피드백 제공</li>
                </ul>
            </li>
            </ul>
        </div>
        <div className="bg-black p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-white !mb-20">이 에디터 시스템은 "컴포넌트 기반 아키텍처"와 "서비스 지향 아키텍처"의 원칙을 결합한 구조입니다. React Query를 통한 선언적 데이터 페칭, 커스텀 훅을 통한 로직 재사용, 그리고 다중 데이터베이스 통합을 통해 복잡한 편집 기능을 구현하면서도 코드의 유지보수성과 확장성을 확보했습니다. 특히 관심사 분리와 컴포넌트 캡슐화를 통해 개방-폐쇄 원칙을 준수하면서도 오버엔지니어링을 지양한 실용적인 설계가 특징입니다.</p>
        </div>
    </div>
    )
}

export default HomeStudy;
