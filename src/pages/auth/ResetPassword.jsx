import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import authService from '../../services/auth.service'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'
import logoImg from '../../assets/logolapakly.png'
import maskotImg from '../../assets/maskot.png'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation
      })

      toast.success('Password berhasil direset 🎉')
      navigate('/login')
    } catch {
      toast.error('Gagal reset password')
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
          <h2 className={styles.loginTitle} style={{ fontSize: '2.2rem', marginBottom: '2rem', letterSpacing: '1px' }}>RESET PASSWORD</h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            
            <div className={styles.inputGroup}>
              <label>Password Baru</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  placeholder="Ketik password baru" 
                  className={styles.pillInput} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Konfirmasi Password Baru</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  placeholder="Ulangi password" 
                  className={styles.pillInput} 
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.pillButton}>
              {loading ? 'MEMPROSES...' : 'SIMPAN PASSWORD'}
            </button>
            
          </form>
        </div>
      </div>

    </div>
  )
}

export default ResetPassword