import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

// Import gambar agar bisa dibaca oleh React (Vite/Webpack)
import logoImg from '../../assets/logolapakly.png'
import maskotImg from '../../assets/maskot.png'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email) newErrors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email tidak valid'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const data = await login(form)
      toast.success(`Selamat datang, ${data.user?.name}!`)

      if (data.user?.role === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Email atau password salah'
      toast.error(msg)
    } finally {
      setIsLoading(false)
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
          <h2 className={styles.loginTitle}>LOGIN</h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            
            <div className={styles.inputGroup}>
              <label>Username</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Ketik username / email" 
                  className={styles.pillInput} 
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Ketik password" 
                  className={styles.pillInput} 
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <button type="submit" disabled={isLoading} className={styles.pillButton}>
              {isLoading ? '...' : 'LOGIN'}
            </button>
            
            <Link to="/forgot-password" className={styles.forgotPassword}>Lupa Password?</Link>
            
            <p className={styles.switchText}>
              Belum punya akun? <Link to="/register" className={styles.switchLink}>Daftar</Link>
            </p>

          </form>
        </div>
      </div>

    </div>
  )
}

export default LoginPage