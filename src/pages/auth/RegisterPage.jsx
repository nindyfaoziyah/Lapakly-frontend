import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'
import logoImg from '../../assets/logolapakly.png'
import maskotImg from '../../assets/maskot.png'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuthContext()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!form.email) newErrors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email tidak valid'
    if (!form.phone) newErrors.phone = 'Nomor HP wajib diisi'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    else if (form.password.length < 8) newErrors.password = 'Password minimal 8 karakter'
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await register(form)
      toast.success('Akun berhasil dibuat! Silakan login.')
      navigate('/login')
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mendaftar, coba lagi'
      toast.error(msg)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
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
      <div className={styles.rightPane} style={{ alignItems: 'flex-start', overflowY: 'auto' }}>
        <div className={styles.formContainer} style={{ margin: 'auto', padding: '1.5rem 1rem', maxWidth: '360px' }}>
          <h2 className={styles.loginTitle} style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>DAFTAR</h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate style={{ gap: '0.75rem' }}>
            
            <div className={styles.inputGroup}>
              <label>Nama Lengkap</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input type="text" name="name" placeholder="Ketik nama lengkap" className={styles.pillInput} value={form.name} onChange={handleChange} required />
              </div>
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input type="email" name="email" placeholder="contoh@email.com" className={styles.pillInput} value={form.email} onChange={handleChange} required />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Nomor HP</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input type="tel" name="phone" placeholder="08xxxxxxxxxx" className={styles.pillInput} value={form.phone} onChange={handleChange} required />
              </div>
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '0.25rem' }}>
              <label>Daftar sebagai:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '6px', fontSize: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: form.role === 'buyer' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}
                  onClick={() => setForm((p) => ({ ...p, role: 'buyer' }))}
                >
                  🛒 Pembeli
                </button>
                <button
                  type="button"
                  style={{ flex: 1, padding: '6px', fontSize: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: form.role === 'seller' ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}
                  onClick={() => setForm((p) => ({ ...p, role: 'seller' }))}
                >
                  🏪 Penjual
                </button>
              </div>
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
                <input type="password" name="password" placeholder="Minimal 8 karakter" className={styles.pillInput} value={form.password} onChange={handleChange} required />
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Konfirmasi Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input type="password" name="password_confirmation" placeholder="Ulangi password" className={styles.pillInput} value={form.password_confirmation} onChange={handleChange} required />
              </div>
              {errors.password_confirmation && <span className={styles.errorText}>{errors.password_confirmation}</span>}
            </div>

            <button type="submit" disabled={isLoading} className={styles.pillButton}>
              {isLoading ? '...' : 'DAFTAR'}
            </button>
            
            <p className={styles.switchText}>
              Sudah punya akun? <Link to="/login" className={styles.switchLink}>Login</Link>
            </p>

          </form>
        </div>
      </div>

    </div>
  )
}

export default RegisterPage
