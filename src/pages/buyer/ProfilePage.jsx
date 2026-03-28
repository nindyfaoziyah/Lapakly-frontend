import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'
import { useState } from 'react'
import authService from '../../services/auth.service'
const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()

  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  })

const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return
    await logout()
    toast.success('Sampai jumpa!')
    navigate('/login')
  }

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async () => {
  setLoading(true)
  try {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
    }

    if (form.password) {
      payload.password = form.password
    }

    await authService.updateProfile(payload)

    toast.success('Profil berhasil diupdate ✨')
    setIsEdit(false)
  } catch {
    toast.error('Gagal update profil')
  } finally {
    setLoading(false)
  }
}

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  const menuItems = [
    { icon:'📋', label:'Pesanan Saya',    onClick:() => navigate('/orders') },
    {
      icon:'🏪', label:'Daftarkan Warung',
      onClick:() => navigate('/seller/register-store'),
      show: user?.role === 'buyer',
    },
    {
      icon:'📊', label:'Dashboard Seller',
      onClick:() => navigate('/seller/dashboard'),
      show: user?.role === 'seller',
    },
  ].filter(i => i.show !== false)

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>{initial}</div>
        </div>
        <h1 className={styles.name}>{user?.name || '-'}</h1>
        <p className={styles.email}>{user?.email}</p>
        <span className={styles.roleBadge}>
          {user?.role === 'seller' ? '🏪 Penjual' : '🛒 Pembeli'}
        </span>
        <Button size="sm" variant="white-outline" onClick={() => setIsEdit(!isEdit)}>
          {isEdit ? 'Batal' : 'Edit Profil'}
        </Button>
      </div>

      <div className={styles.content}>
        {}
        <div className={styles.infoCard}>
  {isEdit ? (
    <>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Nama</span>
        <input className={styles.inputField} name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className={styles.infoDivider} />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Email</span>
        <input className={styles.inputField} name="email" value={form.email} onChange={handleChange} />
      </div>

      <div className={styles.infoDivider} />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>No. HP</span>
        <input className={styles.inputField} name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <div className={styles.infoDivider} />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Password</span>
        <input
          className={styles.inputField}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Kosongkan jika tidak diubah"
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <Button onClick={handleSubmit} isLoading={loading} fullWidth>
          Simpan Perubahan
        </Button>
      </div>
    </>
  ) : (
    <>
      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Nama</span>
        <span className={styles.infoValue}>{user?.name || '-'}</span>
      </div>

      <div className={styles.infoDivider} />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Email</span>
        <span className={styles.infoValue}>{user?.email || '-'}</span>
      </div>

      <div className={styles.infoDivider} />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>No. HP</span>
        <span className={styles.infoValue}>{user?.phone || '-'}</span>
      </div>
    </>
  )}
</div>
        </div>

        {}
        <div className={styles.sectionLabel}>Tampilan</div>
        <div className={styles.themeCard}>
          <ThemeToggle />
        </div>

        {}
        <div className={styles.menuCard}>
          {menuItems.map((item, i) => (
            <button key={i} className={styles.menuItem} onClick={item.onClick}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        {}
        <Button variant="outline" fullWidth onClick={handleLogout}>
          Keluar dari Akun
        </Button>
      </div>
  )
}

export default ProfilePage
