import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import storeService from '../../services/store.service'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'
import styles from './SellerStorePage.module.css'

const SellerStorePage = () => {
  const navigate = useNavigate()

  const [store, setStore]     = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving]   = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const [form, setForm] = useState({
    store_name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getMyStore()
        const s = data.store || data
        setStore(s)
        setForm({
          store_name:  s.store_name || s.name || '',
          description: s.description || '',
          address:     s.address     || '',
          latitude:    String(s.latitude  || ''),
          longitude:   String(s.longitude || ''),
        })
      } catch {

      } finally {
        setIsLoading(false)
      }
    }
    fetchStore()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung geolocation')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          latitude:  String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
        }))
        toast.success('Lokasi berhasil diambil!')
        setIsLocating(false)
      },
      () => {
        toast.error('Gagal mengambil lokasi')
        setIsLocating(false)
      }
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.store_name.trim()) errs.store_name = 'Nama warung wajib diisi'
    if (!form.address.trim())    errs.address    = 'Alamat wajib diisi'
    if (!form.latitude)          errs.latitude   = 'Latitude wajib diisi'
    if (!form.longitude)         errs.longitude  = 'Longitude wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    try {
      const payload = {
        store_name:  form.store_name,
        description: form.description,
        address:     form.address,
        latitude:    parseFloat(form.latitude),
        longitude:   parseFloat(form.longitude),
      }

      if (store) {
        await storeService.updateStore(store.id, payload)
        toast.success('Informasi warung diperbarui!')
      } else {
        await storeService.createStore(payload)
        toast.success('Warung berhasil dibuat!')
      }
      navigate('/seller/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan warung'
      toast.error(msg)
      if (err.response?.data?.errors) setErrors(err.response.data.errors)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <Loading fullScreen text="Memuat info warung..." />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className={styles.title}>{store ? 'Edit Warung' : 'Daftarkan Warung'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className={styles.content}>
        {!store && (
          <div className={styles.infoBox}>
            <span>👋</span>
            <p>Daftarkan warungmu untuk mulai menerima pesanan secara online!</p>
          </div>
        )}

        <div className={styles.formGroup}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Nama Warung <span style={{color:'#d64545'}}>*</span></label>
            <input className={styles.formInput} name="store_name" placeholder="Contoh: Warung Makan Pak Budi" value={form.store_name} onChange={handleChange} />
            {errors.store_name && <span className={styles.errorText}>{errors.store_name}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Deskripsi Warung</label>
            <textarea
              name="description"
              className={styles.textarea}
              placeholder="Ceritakan sedikit tentang warungmu..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Alamat Lengkap <span style={{color:'#d64545'}}>*</span></label>
            <input className={styles.formInput} name="address" placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan" value={form.address} onChange={handleChange} />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
          </div>
        </div>

        {}
        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <h3 className={styles.locationTitle}>Koordinat Lokasi</h3>
            <button className={styles.btnGhost} disabled={isLocating} onClick={handleGetLocation}>
               📍 {isLocating ? 'Mengambil...' : 'Ambil GPS'}
            </button>
          </div>
          <p className={styles.locationNote}>
            Koordinat digunakan untuk menampilkan warungmu di pencarian pembeli.
          </p>
          <div className={styles.coordRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Latitude <span style={{color:'#d64545'}}>*</span></label>
              <input className={styles.formInput} name="latitude" type="number" placeholder="-6.2088" value={form.latitude} onChange={handleChange} />
              {errors.latitude && <span className={styles.errorText}>{errors.latitude}</span>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Longitude <span style={{color:'#d64545'}}>*</span></label>
              <input className={styles.formInput} name="longitude" type="number" placeholder="106.8456" value={form.longitude} onChange={handleChange} />
              {errors.longitude && <span className={styles.errorText}>{errors.longitude}</span>}
            </div>
          </div>
          {form.latitude && form.longitude && (
            <p className={styles.coordPreview}>
              📍 {parseFloat(form.latitude).toFixed(6)}, {parseFloat(form.longitude).toFixed(6)}
            </p>
          )}
        </div>

        <button className={styles.btnPrimary} style={{marginTop:'16px'}} disabled={isSaving} onClick={handleSave}>
          {isSaving ? 'Menyimpan...' : (store ? 'Simpan Perubahan' : 'Daftarkan Warung')}
        </button>
      </div>
    </div>
  )
}

export default SellerStorePage
