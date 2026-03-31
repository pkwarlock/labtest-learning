import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="title">ShellQuest</h1>
      <p className="subtitle">เรียนรู้ Shell Script ผ่านเกม</p>
      <p className="description">
        ฝึกเขียน Shell Script และเรียนรู้ AWS, Azure, DevOps, GitOps, ArgoCD ผ่าน 110 ด่านที่ท้าทาย
        เรียนรู้คำสั่งจริง ลองเขียนโค้ดจริง และพัฒนาทักษะของคุณทีละขั้นตอน
      </p>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">110</div>
          <div className="stat-label">ด่าน</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">2</div>
          <div className="stat-label">หมวดหมู่</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5</div>
          <div className="stat-label">ระดับความยาก</div>
        </div>
      </div>
      <Link to="/levels"><button className="btn-start">เริ่มเล่น</button></Link>
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <div className="feature-title">เรียนรู้ทีละขั้น</div>
          <p>เนื้อหาเรียงจากง่ายไปยาก เหมาะสำหรับผู้เริ่มต้น</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💻</div>
          <div className="feature-title">ลองเขียนโค้ดจริง</div>
          <p>เขียนและรันโค้ดได้ทันทีในเบราว์เซอร์</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <div className="feature-title">ท้าทายตัวเอง</div>
          <p>ปลดล็อกด่านใหม่และติดตามความก้าวหน้า</p>
        </div>
      </div>
    </div>
  )
}
