import React from 'react'

const HomeIntroduce : React.FC = () => {
    return (
    <div className='text-start h-full'>
        <h2 className="text-2xl font-bold mb-4">Introduce 컴포넌트의 아키텍처 구조</h2>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">1. 데이터 관리 계층 (Data Layer)</h3>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                <span className="font-medium">React Query 훅</span>: 서버 데이터 상태 관리
                <ul className="list-circle pl-5 mt-1">
                    <li>사용자 정보 조회 (<code className="bg-red-100 text-black px-1 rounded">useQuery</code> - 'user')</li>
                    <li>자기소개서 데이터 조회 (<code className="bg-red-100 text-black px-1 rounded">useQuery</code> - 'introduction')</li>
                    <li>각 섹션별 업데이트 뮤테이션 (<code className="bg-red-100 text-black px-1 rounded">useMutation</code>)</li>
                </ul>
                </li>
                <li>
                <span className="font-medium">서비스 계층</span>: API 호출 로직 분리
                <ul className="list-circle pl-5 mt-1">
                    <li>
                        <code className="bg-red-100 text-black px-1 rounded">getUser()</code>, 
                        <code className="bg-red-100 text-black px-1 rounded">getIntroduction()</code>, 
                        <code className="bg-red-100 text-black px-1 rounded">putMotivation()</code> 등의 함수를 외부 서비스 파일에서 불러와 사용</li>
                </ul>
                </li>
            </ul>
            </div>
            <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">2. 상태 관리 계층 (State Layer)</h3>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                <span className="font-medium">로컬 UI 상태</span>: React의 <code className="bg-red-100 text-black px-1 rounded">useState</code>로 관리
                <ul className="list-circle pl-5 mt-1">
                    <li>편집 모드 상태   (<code className="bg-red-100 text-black px-1 rounded">isEditing</code>)</li>
                    <li>로컬 데이터 캐싱 (<code className="bg-red-100 text-black px-1 rounded">localIntroduction</code>)</li>
                </ul>
                </li>
                <li>
                <span className="font-medium">React Query의 상태 동기화</span>: <code className="bg-red-100 text-black px-1 rounded">useEffect</code>를 통해 서버 데이터와 로컬 상태 동기화
                </li>
            </ul>
            </div>
            <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">3. 이벤트 핸들링 계층 (Event Layer)</h3>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                <span className="font-medium">커스텀 훅 기반 이벤트 처리</span>:
                <ul className="list-circle pl-5 mt-1">
                    <li><code className="bg-red-100 text-black px-1 rounded">useClickHandler</code>: 버튼 클릭 이벤트 처리</li>
                    <li><code className="bg-red-100 text-black px-1 rounded">useChangeHandler</code>: 텍스트 영역 변경 이벤트 처리</li>
                </ul>
                </li>
                <li>
                <span className="font-medium">이벤트 분기 처리</span>: 이벤트 대상에 따른 다양한 로직 분기
                </li>
            </ul>
            </div>
            <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">4. UI 렌더링 계층 (Presentation Layer)</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                    <span className="font-medium">조건부 렌더링</span>: 로딩/에러/데이터 상태에 따른 UI 분기
                    </li>
                    <li>
                    <span className="font-medium">레이아웃 구성</span>: 사이드바(프로필) + 메인 컨텐츠(자기소개서) 구조
                    </li>
                    <li>
                    <span className="font-medium">재사용 가능한 컴포넌트</span>: 
                        <code className="bg-red-100 text-black px-1 rounded">VariableInfo</code>, 
                        <code className="bg-red-100 text-black px-1 rounded">CommonBtn</code>, 
                        <code className="bg-red-100 text-black px-1 rounded">Loading</code> 등의 UI 컴포넌트 활용
                    </li>
                </ul>
            </div>
            <div className="bg-black p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-white">이 구조는 "프론트엔드 클린 아키텍처"를 기반으로, 각 계층이 명확히 분리되어 있어 코드의 유지보수성과 확장성을 높입니다. 데이터 흐름이 단방향으로 이루어지며, 관심사 분리 원칙을 준수합니다.</p>
        </div>
    </div>
    )
}

export default HomeIntroduce;
