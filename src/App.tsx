import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import Profile from './pages/Profile'
import Home from './pages/Home'
import TroubleShooting from './pages/TroubleShooting'

const App : React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
          <Route index element = {<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/trouble' element={<TroubleShooting />} />
      </Route>
    </Routes>
  )
}

export default App
