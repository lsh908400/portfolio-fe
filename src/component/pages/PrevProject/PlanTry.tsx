import React from 'react';

// 타입 정의
interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
}

const PlanTry: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <header className="bg-gradient-to-r from-purple-500 to-purple-300 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-full">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">📑 PLANTRY</h1>
              <h2 className="text-xl md:text-2xl font-bold mb-6">아이디어를 심고, 성장과 수확을 경험하세요!</h2>
              <p className="text-xl mb-8">그룹웨어 기반 협업 플랫폼 개발 프로젝트</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="https://github.com/lsh908400/Plantry-front" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-gray-100">
                  <span className="mr-2">🔗</span>FE GitHub 보기
                </a>
                <a href="https://github.com/lsh908400/Plantry" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-gray-100">
                  <span className="mr-2">🔗</span>BE GitHub 보기
                </a>
                <a href="https://www.youtube.com/watch?v=gYq8mfhy5Bk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-gray-100">
                  <span className="mr-2">📺</span> 시연 영상 보기
                </a>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span>📅</span>
                <span>2024.11.18 ~ 2024.12.27 (40일간)</span>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
            </div>
          </div>
        </div>
      </header>

      {/* 주요 기능 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <FeatureCard iconName="📁" title="공유 드라이브" description="실시간 파일 공유 및 협업 작업이 가능한 클라우드 스토리지" />
            <FeatureCard iconName="📊" title="프로젝트 관리" description="태스크 할당, 일정 관리, 진행 상황 추적 기능" />
            <FeatureCard iconName="💬" title="사내 메신저" description="실시간 커뮤니케이션 및 팀 채팅 기능" />
            <FeatureCard iconName="⏰" title="근태 관리" description="출퇴근 기록, 휴가 신청, 근무 시간 분석" />
            <FeatureCard iconName="📝" title="커뮤니티 게시판" description="공지사항, 자유 게시판, 부서별 소통 공간" />
          </div>
        </div>
      </section>

      {/* 내가 기여한 부분 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">담당 기능</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            
            <h4 className="text-xl font-semibold mt-8 mb-4 text-gray-800">주요 기여 사항</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-900">실시간 공유 페이지 기능</span>
                  <p className="text-gray-600 mt-1">여러 사용자가 동시에 문서를 편집하고 변경 사항을 실시간으로 확인할 수 있는 기능 구현</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-900">실시간 공유 달력 기능</span>
                  <p className="text-gray-600 mt-1">팀 및 개인 일정을 공유하고 실시간으로 업데이트되는 달력 시스템 개발</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-900">팀/그룹/로그인 기능</span>
                  <p className="text-gray-600 mt-1">조직 구조에 맞는 팀 및 그룹 관리 시스템과 보안 로그인 기능 구현</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <div>
                  <span className="font-medium text-gray-900">NginX를 이용한 로드 밸런싱</span>
                  <p className="text-gray-600 mt-1">2개의 백엔드 서버를 Round-Robin 방식으로 로드 밸런싱하고, 별도의 파일 서버를 구성하여 시스템 안정성 및 성능 향상</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">아키텍처 및 인프라 구성</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold mb-4 text-green-700">서버 아키텍처</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">로드 밸런서 (NginX)</p>
                    <p className="text-gray-600 text-sm">클라이언트 요청을 여러 서버에 분산하여 시스템 부하 관리</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">백엔드 서버 (2대)</p>
                    <p className="text-gray-600 text-sm">Round-Robin 방식으로 트래픽 분산 처리</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">파일 서버</p>
                    <p className="text-gray-600 text-sm">공유 드라이브 파일 저장 및 관리 전용 서버</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-green-700">실시간 기능 구현</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">WebSocket</p>
                    <p className="text-gray-600 text-sm">실시간 양방향 통신으로 메시지 및 알림 전송</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">Redis Pub/Sub</p>
                    <p className="text-gray-600 text-sm">서버 간 실시간 데이터 동기화 및 이벤트 브로드캐스팅</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded shadow-sm">
                    <p className="font-medium text-gray-800 mb-2">React Query</p>
                    <p className="text-gray-600 text-sm">프론트엔드 데이터 캐싱 및 실시간 업데이트</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">개발 환경</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-700">백엔드</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 기술</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프로그래밍 언어</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Java 17</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프레임워크</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Spring Boot 3.3.5, Spring Security 6.2.2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">개발 도구</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IntelliJ IDEA</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">데이터베이스</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MySQL 8.0.26, MongoDB, Redis</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">주요 라이브러리</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Spring Data JPA, QueryDSL, WebSocket, JWT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-700">프론트엔드</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 기술</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프로그래밍 언어</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JavaScript 6, HTML 5, CSS 3</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프레임워크/라이브러리</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">React 18.3.1, Redux Toolkit, React Query</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">개발 도구</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vite 5.4.10, VS Code</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">UI 컴포넌트</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ShadCN UI, FullCalendar, Framer Motion</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">주요 라이브러리</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Axios, Zustand, Recharts, TinyMCE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-10 bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-700">인프라 및 배포</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 기술</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">클라우드 환경</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AWS EC2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">웹 서버</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NginX (로드 밸런싱)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">버전 관리</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Git Bash</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">협업 도구</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GitHub Project, Slack, Notion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 성과 섹션 */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-purple-300 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">주요 성과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold mb-2">팀 리더십</h3>
              <p>성공적인 프로젝트 일정 관리와 팀원 간 효율적인 협업 유도</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">실시간 기능 구현</h3>
              <p>WebSocket과 Redis를 활용한 강력한 실시간 협업 기능 개발</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-2">서버 확장성</h3>
              <p>로드 밸런싱을 통한 시스템 안정성 및 확장성 확보</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold mb-2">모듈화 설계</h3>
              <p>유지보수와 기능 확장이 용이한 모듈화된 코드 아키텍처 구현</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">PLANTRY 협업 플랫폼 프로젝트</h2>
              <p className="text-gray-400">2024년 11월 18일 ~ 2024년 12월 27일</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/lsh908400/Plantry-front" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="text-2xl">🔗</span>
              </a>
              <a href="https://github.com/lsh908400/Plantry" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="text-2xl">🔗</span>
              </a>
              <a href="https://www.youtube.com/watch?v=gYq8mfhy5Bk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="text-2xl">📺</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 기능 카드 컴포넌트
const FeatureCard: React.FC<FeatureCardProps> = ({ iconName, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
        <span className="text-2xl">{iconName}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default PlanTry;