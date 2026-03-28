import { Link } from 'react-router-dom'
import { formatRupiah } from '../../utils/formatCurrency'
import Badge from '../common/Badge'
import styles from './OrderCard.module.css'
import orderService from '../../services/order.service' //tambahan yang baru

const OrderCard = ({ order, onUpdate, isSeller = false }) => {
  const { id, store, order_items, total_price, status, order_type, created_at } = order

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

  const itemCount = order_items?.reduce((acc, i) => acc + i.quantity, 0) || 0 //tambahan baru

  const handleAction = async (e, action) => {
    e.preventDefault() // biar gak redirect ke detail

    try {
      if (action === 'accept') {
        await orderService.acceptOrder(id)
      } else if (action === 'prepare') {
        await orderService.prepareOrder(id)
      } else if (action === 'complete') {
        await orderService.completeOrder(id)
      }

      onUpdate && onUpdate()
    } catch (err) {
      console.error(err)
    }
  } //tambahan baru function

  return (
    <Link to={`/orders/${id}`} className={styles.card}>
      {}
      <div className={styles.header}>
        <div>
          <p className={styles.storeName}>{store?.store_name || 'Toko'}</p>
          <p className={styles.date}>{formattedDate}</p>
        </div>
        <Badge status={status} />
      </div>

      <div className={styles.divider} />

      {}
      <p className={styles.itemSummary}>
        {itemCount} item ·{' '}
        <span className={styles.orderType}>
          {order_type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'}
        </span>
      </p>

      {}
      <div className={styles.footer}>
        <span className={styles.totalLabel}>Total Bayar</span>
        <span className={styles.total}>{formatRupiah(total_price)}</span>
      </div>

        {isSeller && (
        <div style={{ marginTop: '10px' }}>
          {status === 'pending' && (
            <button onClick={(e) => handleAction(e, 'accept')}>
              Terima
            </button>
          )}

          {status === 'accepted' && (
            <button onClick={(e) => handleAction(e, 'prepare')}>
              Siapkan
            </button>
          )}

          {status === 'preparing' && (
            <button onClick={(e) => handleAction(e, 'complete')}>
              Selesai
            </button>
          )}
        </div>
      )} /*tambahan baru untuk seller*/
    </Link>
  )
}

export default OrderCard
