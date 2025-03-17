import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

// MainLayout은 기본 레이아웃으로 즉시 로딩
import MainLayout from './layout/MainLayout'

// 각 페이지 컴포넌트를 lazy로 로딩
const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))
const TroubleShooting = lazy(() => import('./pages/TroubleShooting'))
const Study = lazy(() => import('./pages/Study'))
const MiniProject = lazy(() => import('./pages/MiniProject'))
const Job = lazy(() => import('./pages/Job'))
const PrevProject = lazy(() => import('./pages/PrevProject'))

// 로딩 중 표시할 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-2">로딩 중...</p>
  </div>
)

// Suspense로 감싸는 HOC (Higher Order Component)
const LazyComponent = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
)

// 라우트 설정을 객체 배열로 정의
const routes = [
  { path: '/', element: Home, index: true },
  { path: '/profile', element: Profile },
  { path: '/trouble', element: TroubleShooting },
  { path: '/study', element: Study },
  { path: '/mini', element: MiniProject },
  { path: '/job', element: Job },
  { path: '/prevproject', element: PrevProject }
]

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.index ? undefined : route.path}
            index={route.index}
            element={LazyComponent(route.element)}
          />
        ))}
      </Route>
    </Routes>
  )
}

export default App