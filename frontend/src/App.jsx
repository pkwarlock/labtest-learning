import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LevelSelect from './pages/LevelSelect'
import GamePlay from './pages/GamePlay'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/levels" element={<LevelSelect />} />
      <Route path="/play/:id" element={<GamePlay />} />
    </Routes>
  )
}
