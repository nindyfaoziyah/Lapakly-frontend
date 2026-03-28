import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../../services/auth.service'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'
import logoImg from '../../assets/logolapakly.png'
import maskotImg from '../../assets/maskot.png'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      toast.success('Link reset dikirim ke email kamu 📩')
    } catch {
      toast.error('Gagal mengirim email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.splitPage}>
      
      {/* LEFT COLUMN */}
      <div className={styles.leftPane}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>
            <img src={logoImg} alt="Logo" className={styles.logoImage} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoBrand}>LAPKLY</span>
            <span className={styles.logoSub}>UMKM Mart</span>
          </div>
        </div>

        <div className={styles.illustrationWrapper}>
          <div className={styles.abstractBlob}>
            <div className={styles.blobOuter}></div>
            <div className={styles.blobInner}></div>
          </div>
          <div className={styles.illustrationContent}>
             <div style={{ zIndex: 3, position: 'relative', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}>
               <img src={maskotImg} alt="Maskot" className={styles.maskotImage} />
             </div>
          </div>
        </div>
      </div>

      {/* WAVE SEPARATOR */}
      <svg className={styles.waveSeparator} viewBox="0 0 100 800" preserveAspectRatio="none">
        <path d="M100,0 C-30,250 130,550 0,800 L100,800 Z" fill="#006633" />
      </svg>

      {/* RIGHT COLUMN */}
      <div className={styles.rightPane}>
        <div className={styles.formContainer}>
          <h2 className={styles.loginTitle} style={{ fontSize: '2.2rem', marginBottom: '1rem', letterSpacing: '1px' }}>LUPA PASSWORD</h2>
          <p style={{ color: '#cce0d6', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Masukkan email terdaftar untuk menerima link reset.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            
            <div className={styles.inputGroup}>
              <label>Email Terdaftar</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input 
                  type="email" 
                  placeholder="contoh@email.com" 
                  className={styles.pillInput} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.pillButton}>
              {loading ? 'MENGIRIM...' : 'KIRIM LINK RESET'}
            </button>
            
            <p className={styles.switchText}>
              Ingat password Anda? <Link to="/login" className={styles.switchLink}>Login di sini</Link>
            </p>

          </form>
        </div>
      </div>

    </div>
  )
}

export default ForgotPassword