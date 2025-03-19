import React from 'react';

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
}

const LotteOn: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <header className="bg-gradient-to-r from-red-700 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-full">
              <h1 className="text-4xl md:text-5xl font-bold !mb-4">🛒 더 나은 쇼핑의 발견</h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">LOTTE ON</h2>
              <p className="text-xl mb-8">롯데e-커머스 LOTTE ON 쇼핑몰 개발 프로젝트</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="https://github.com/lsh908400/shoppingmall" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-gray-100">
                  <span className="mr-2">🔗</span> GitHub 보기
                </a>
                <a href="https://www.youtube.com/watch?v=rM2Cj0PMg1Q&t=5s" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-gray-100">
                  <span className="mr-2">📺</span> 시연 영상 보기
                </a>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span>📅</span>
                <span>2024.10.14 ~ 2024.11.15 (33일간)</span>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
            </div>
          </div>
        </div>
      </header>

      {/* 담당 기능 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">담당 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FeatureCard iconName="💬" title="AI 챗봇" description="사용자 질문에 자동 응답하는 인공지능 챗봇 , 주문관련 업무 처리 가능" />
            <FeatureCard iconName="🔍" title="연관검색 / 실시간검색" description="사용자 검색 패턴 분석 및 실시간 인기 검색어 제공" />
            <FeatureCard iconName="🛍️" title="실시간 베스트상품" description="판매량 기준 실시간 인기 상품 추천 시스템" />
            <FeatureCard iconName="⭐" title="고객별 상품 추천 TOP5" description="개인 맞춤형 상품 추천 알고리즘 구현" />
            <FeatureCard iconName="❤️" title="찜목록" description="사용자 관심 상품 저장 및 관리 기능" />
            <FeatureCard iconName="👤" title="회원가입" description="사용자 계정 생성 및 관리 시스템" />
            <FeatureCard iconName="📊" title="관리자 사이트 통계" description="접속인원, 판매, 주문 등 실시간 데이터 분석" />
            <FeatureCard iconName="📦" title="주문취소 알고리즘" description="효율적인 주문 취소 포인트롤백 , 쿠폰 롤백 처리 시스템 구현" />
            <FeatureCard iconName="✍️" title="리뷰" description="상품 리뷰 작성 및 조회 관리 기능" />
            <FeatureCard iconName="🏷️" title="쿠폰 / 포인트" description="할인 쿠폰 및 적립금 관리 시스템" />
            <FeatureCard iconName="📅" title="출석 이벤트" description="사용자 참여형 출석 체크 이벤트 구현" />
            <FeatureCard iconName="📍" title="배송지 관리" description="사용자별 다중 배송지 등록 및 관리" />
            <FeatureCard iconName="🖥️" title="서버 설계" description="확장성 있는 서버 아키텍처 설계" />
            <FeatureCard iconName="💾" title="DB 설계" description="효율적인 데이터베이스 스키마 설계" />
            <FeatureCard iconName="📁" title="카테고리" description="상품 카테고리 구조 및 관리 시스템" />
            <FeatureCard iconName="🛒" title="장바구니 옵션 관리" description="다양한 상품 옵션 선택 및 장바구니 관리" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">시스템 아키텍처</h2>
          
          <div className="bg-gray-50 rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">전체 아키텍처 구성</h3>
            
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <h4 className="text-lg font-semibold mb-4 text-red-600">프론트엔드 (Presentation Layer)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Thymeleaf 템플릿 엔진</span>: 서버 사이드 렌더링으로 SEO 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">JavaScript & Axios</span>: 동적 사용자 인터페이스 구현</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <h4 className="text-lg font-semibold mb-4 text-red-600">백엔드 (Application Layer)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Spring MVC</span>: 요청 처리 및 라우팅</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Spring Security</span>: 인증 및 권한 관리</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">JWT</span>: 토큰 기반 소셜 로그인 인증</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">OAuth2</span>: 소셜 로그인 연동</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <h4 className="text-lg font-semibold mb-4 text-red-600">데이터 레이어 (Data Layer)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Spring Data JPA</span>: 객체-관계 매핑</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">QueryDSL</span>: 동적 쿼리가 필요한 다중검색 쿼리 작성</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Redis</span>: 캐싱 및 세션 관리</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <h4 className="text-lg font-semibold mb-4 text-red-600">인프라 및 배포 (Infrastructure)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">Apache Tomcat</span>: 서블릿 컨테이너</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">로깅 시스템</span>: 사용자 행동 및 오류 추적</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><span className="font-medium">모니터링</span>: 시스템 상태 및 성능 측정</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-6">주요 설계 원칙</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-3 text-red-600">계층형 아키텍처 (Layered Architecture)</h4>
                <p className="text-gray-700">
                  프레젠테이션, 비즈니스 로직, 데이터 액세스 계층을 명확하게 분리하여 유지보수성 향상 및 관심사 분리를 통한 코드 품질 개선
                </p>
              </div>             
            </div>
          </div>
        </div>
      </section>

      {/* 개발 환경 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">개발 환경</h2>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">서비스 환경</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 기술</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프로그래밍 언어</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Java 17, JavaScript 6, HTML 5, CSS 3</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프레임워크</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Spring Boot 3.3.4, Spring Security 6.3.3</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">템플릿 엔진</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Thymeleaf 3.1.2, Thymeleaf Layout Dialect, FreeMarker</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">개발 도구 및 IDE</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IntelliJ IDEA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">버전 관리</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Git Bash</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DB 및 스토리지</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MySQL 8.0.26, MongoDB, Redis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">운영 환경</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apache Tomcat</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">협업</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GitHub Project, Slack / Notion / Google Sheet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">사용 라이브러리</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">라이브러리명</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">버전</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">용도</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">mysql-connector-java</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.0.33</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MySQL 연동</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">hibernate-core</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.5.2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JPA 구현체로 Hibernate 사용</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">spring-security-oauth2-client</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.3.3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">OAuth2 클라이언트 기능 지원</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">jjwt-api</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.12.3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JWT 생성 및 검증</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">modelmapper</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.2.1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DTO ↔ Entity 변환 도구</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 성과 섹션 */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">주요 성과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">팀장</h3>
              <p>프로젝트 일정 및 팀원 관리 담당</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">핵심 기능 구현</h3>
              <p>AI 기반 추천 시스템 및 관리자 통계 기능 개발</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🖥️</div>
              <h3 className="text-xl font-semibold mb-2">서버 아키텍처</h3>
              <p>확장성 있는 서버 및 DB 설계 주도</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">협업 문화</h3>
              <p>효율적인 협업 체계 구축 및 커뮤니케이션 주도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">LOTTE ON 쇼핑몰 프로젝트</h2>
              <p className="text-gray-400">2024년 10월 14일 ~ 2024년 11월 15일</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/lsh908400/shoppingmall" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="text-2xl">🔗</span>
              </a>
              <a href="https://www.youtube.com/watch?v=rM2Cj0PMg1Q&t=5s" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
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
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-lg mb-4">
        <span className="text-2xl">{iconName}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default LotteOn;