import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function GamePlay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [level, setLevel] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showLesson, setShowLesson] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch(`/api/levels/${id}`).then(r => r.json()).then(data => {
      setLevel(data)
      setCode(data.initialCode || '#!/bin/bash\n')
    })
    setOutput('')
    setShowHint(false)
    setShowLesson(true)
    setShowModal(false)
  }, [id])

  const run = () => {
    fetch('/api/execute', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    }).then(r => r.json()).then(d => setOutput(d.stdout || d.stderr || ''))
  }

  const validate = () => {
    fetch(`/api/validate/${id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    }).then(r => r.json()).then(d => {
      if (d.passed) {
        const prog = JSON.parse(localStorage.getItem('shellquest-progress') || '[]')
        if (!prog.includes(Number(id))) {
          prog.push(Number(id))
          localStorage.setItem('shellquest-progress', JSON.stringify(prog))
        }
        setShowModal(true)
      } else {
        setOutput(`ยังไม่ผ่าน!\nผลลัพธ์ของคุณ: ${d.output}\nคำตอบที่ต้องการ: ${d.expected}`)
      }
    })
  }

  const markRead = () => {
    const prog = JSON.parse(localStorage.getItem('shellquest-progress') || '[]')
    if (!prog.includes(Number(id))) {
      prog.push(Number(id))
      localStorage.setItem('shellquest-progress', JSON.stringify(prog))
    }
    setShowModal(true)
  }

  if (!level) return <div style={{padding:'2rem',textAlign:'center'}}>กำลังโหลด...</div>

  const numId = Number(id)
  const isLessonOnly = level.type === 'lesson'

  if (isLessonOnly) {
    return (
      <div>
        <nav className="nav">
          <Link to="/levels" className="nav-logo">← กลับ</Link>
          <div className="nav-links"><span>บทที่ {id}</span></div>
        </nav>
        <div className="lesson-page">
          <div className="lesson-header">
            <span className="lesson-category">{level.category.toUpperCase()}</span>
            <h2>{level.title}</h2>
          </div>
          <pre className="lesson-full">{level.lesson}</pre>
          <div className="lesson-actions">
            {numId > 1 && <button className="btn-nav" onClick={() => navigate(`/play/${numId-1}`)}>← บทก่อนหน้า</button>}
            <button className="btn-validate" onClick={markRead}>✓ อ่านจบแล้ว</button>
            {numId < 110 && <button className="btn-nav" onClick={() => navigate(`/play/${numId+1}`)}>บทถัดไป →</button>}
          </div>
        </div>
        {showModal && (
          <div className="success-modal">
            <div className="modal-card">
              <div className="modal-icon">📖</div>
              <div className="modal-title">อ่านจบแล้ว!</div>
              <div className="modal-msg">บทที่ {id}: {level.title}</div>
              {numId < 110
                ? <button className="btn-next" onClick={() => navigate(`/play/${numId+1}`)}>บทถัดไป →</button>
                : <button className="btn-next" onClick={() => navigate('/levels')}>กลับหน้าเลือกบท</button>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/levels" className="nav-logo">← กลับ</Link>
        <div className="nav-links"><span>ด่านที่ {id}</span></div>
      </nav>
      <div className="gameplay">
        <div className="instructions-panel">
          <div className="level-number">ด่านที่ {id} / 60</div>
          <h2>{level.title}</h2>
          {level.lesson && (
            <div className="lesson-box">
              <button className="btn-lesson" onClick={() => setShowLesson(!showLesson)}>
                {showLesson ? '📖 ซ่อนบทเรียน' : '📖 อ่านบทเรียนก่อน'}
              </button>
              {showLesson && <pre className="lesson-content">{level.lesson}</pre>}
            </div>
          )}
          <div className="level-desc">{level.description}</div>
          {level.hint && (
            <>
              <button className="btn-hint" onClick={() => setShowHint(!showHint)}>
                {showHint ? 'ซ่อนคำใบ้' : 'แสดงคำใบ้'}
              </button>
              {showHint && <div className="hint-box">{level.hint}</div>}
            </>
          )}
        </div>
        <div className="editor-panel">
          <div className="code-editor">
            <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
          </div>
          <div className="editor-actions">
            <button className="btn-run" onClick={run}>▶ รัน</button>
            <button className="btn-validate" onClick={validate}>✓ ตรวจคำตอบ</button>
          </div>
          <div className="level-nav">
            {numId > 1 && <button className="btn-nav" onClick={() => navigate(`/play/${numId-1}`)}>← ด่านก่อนหน้า</button>}
            {numId < 110 && <button className="btn-nav" onClick={() => navigate(`/play/${numId+1}`)}>ด่านถัดไป →</button>}
          </div>
          <div className="terminal">
            <div className="terminal-label">$ เทอร์มินัล</div>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="success-modal">
          <div className="modal-card">
            <div className="modal-icon">🎉</div>
            <div className="modal-title">ยินดีด้วย!</div>
            <div className="modal-msg">คุณผ่านด่านที่ {id} แล้ว!</div>
            {numId < 110
              ? <button className="btn-next" onClick={() => navigate(`/play/${numId+1}`)}>ด่านถัดไป →</button>
              : <button className="btn-next" onClick={() => navigate('/levels')}>กลับหน้าเลือกด่าน</button>}
          </div>
        </div>
      )}
    </div>
  )
}
