import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LevelSelect() {
  const [levels, setLevels] = useState([])
  const [tab, setTab] = useState('all')
  const navigate = useNavigate()

  const progress = JSON.parse(localStorage.getItem('shellquest-progress') || '[]')

  useEffect(() => {
    fetch('/api/levels').then(r => r.json()).then(setLevels)
  }, [])

  const filtered = tab === 'all' ? levels : levels.filter(l => l.category === tab)

  const categoryFirstIds = [...new Set(levels.map(l => l.category))].reduce((acc, cat) => {
    const first = levels.find(l => l.category === cat)
    if (first) acc.push(first.id)
    return acc
  }, [])

  const isUnlocked = (lvl) => {
    if (categoryFirstIds.includes(lvl.id)) return true
    return progress.includes(lvl.id - 1)
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="nav-logo">ShellQuest</Link>
        <div className="nav-links"><Link to="/">หน้าแรก</Link></div>
      </nav>
      <div className="level-select">
        <h2 className="page-title">เลือกบทเรียน</h2>
        <div className="category-tabs">
          {[['all','ทั้งหมด'],['basic','Shell พื้นฐาน'],['advanced','Shell ขั้นสูง'],['aws','☁️ AWS'],['azure','☁️ Azure'],['devops','🔧 DevOps'],['gitops','🔄 GitOps'],['argocd','🚀 ArgoCD']].map(([k,v]) => (
            <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={() => setTab(k)}>{v}</button>
          ))}
        </div>
        <div className="level-grid">
          {filtered.map(lvl => {
            const done = progress.includes(lvl.id)
            const unlocked = isUnlocked(lvl)
            const isLesson = lvl.type === 'lesson'
            return (
              <div key={lvl.id}
                className={`level-card ${done?'completed':''} ${!unlocked?'locked':''} ${isLesson?'lesson-card':''}`}
                onClick={() => unlocked && navigate(`/play/${lvl.id}`)}>
                {done && <span className="completed-check">{isLesson ? '📖' : '✓'}</span>}
                <span className="level-badge">{isLesson ? '📖' : '⌨️'} #{lvl.id}</span>
                <div className="level-title">{lvl.title}</div>
                <div className="level-type">{isLesson ? 'บทเรียน' : 'บททดสอบ'}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
