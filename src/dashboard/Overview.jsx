import { useState, useEffect } from 'react'
import { privateInstance } from '../api/axios'
import { useAuth } from '../context/AuthContext'

export const Overview = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchData = async () => {
        try {
            setLoading(true)
            setError('')
            const [bookingsRes, usersRes, listingsRes] = await Promise.all([
                privateInstance.get('/booking'),
                privateInstance.get('/user'),
                privateInstance.get('/listing'),
            ])
            setStats({
                totalBookings: bookingsRes.data.total || bookingsRes.data.bookings?.length || 0,
                totalUsers: usersRes.data.total || usersRes.data.users?.length || 0,
                totalListings: listingsRes.data.total || listingsRes.data.listings?.length || 0,
                revenue: bookingsRes.data.bookings
                    ?.filter((b) => b.paymentStatus === 'paid')
                    .reduce((acc, b) => acc + b.totalPrice, 0) || 0,
            })
            setBookings(bookingsRes.data.bookings?.slice(0, 5) || [])
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <p style={styles.loading}>Loading...</p>
    if (error) return <p style={styles.error}>{error}</p>
return (
    <div>
        <h1 style={styles.title}>Welcome back, {user?.name} 👋</h1>
        <p style={styles.welcomeSub}>Here's what's happening with EMMEY Travels today.</p>

        {loading && <p style={styles.loading}>Loading stats...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
            <>
                <div style={styles.statsGrid}>
                    {[
                        { label: 'Total Bookings', value: stats?.totalBookings },
                        { label: 'Total Users', value: stats?.totalUsers },
                        { label: 'Total Listings', value: stats?.totalListings },
                        { label: 'Revenue', value: `₦${stats?.revenue?.toLocaleString()}` },
                    ].map((stat) => (
                        <div key={stat.label} style={styles.statCard}>
                            <p style={styles.statLabel}>{stat.label}</p>
                            <p style={styles.statValue}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Recent Bookings</h2>
                    <div style={styles.table}>
                        <div style={styles.tableHeader}>
                            <span>Reference</span>
                            <span>User</span>
                            <span>Route</span>
                            <span>Amount</span>
                            <span>Status</span>
                        </div>
                        {bookings.length === 0 && <p style={styles.empty}>No bookings yet</p>}
                        {bookings.map((booking) => (
                            <div key={booking._id} style={styles.tableRow}>
                                <span style={styles.ref}>{booking.reference}</span>
                                <span>{booking.user?.name || 'N/A'}</span>
                                <span>{booking.listing?.origin} → {booking.listing?.destination}</span>
                                <span>₦{booking.totalPrice?.toLocaleString()}</span>
                                <span style={{ ...styles.badge, ...getBadgeStyle(booking.status) }}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
    </div>
)
}

const getBadgeStyle = (status) => {
    if (status === 'confirmed') return { background: '#f0faf0', color: '#2d7a2d' }
    if (status === 'pending') return { background: '#fff8e6', color: '#b06d00' }
    if (status === 'cancelled') return { background: '#fff0f0', color: '#c00' }
    return {}
}

const styles = {
    title: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#111',
        marginBottom: '4px',
        letterSpacing: '-0.5px',
    },
    welcomeSub: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '32px',
        marginTop: '4px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
    },
    statCard: {
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '12px',
        padding: '20px',
    },
    statLabel: {
        fontSize: '11px',
        color: '#888',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600',
    },
    statValue: { fontSize: '26px', fontWeight: '800', color: '#111' },
    section: { marginTop: '8px' },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111',
        marginBottom: '16px',
    },
    table: {
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1.5fr 1fr 1fr',
        padding: '12px 20px',
        background: '#f9f9f9',
        borderBottom: '1px solid #eee',
        fontSize: '11px',
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1.5fr 1fr 1fr',
        padding: '14px 20px',
        borderBottom: '1px solid #f5f5f5',
        fontSize: '13px',
        color: '#333',
        alignItems: 'center',
    },
    ref: { fontWeight: '600', color: '#111' },
    badge: {
        fontSize: '11px',
        padding: '3px 8px',
        borderRadius: '4px',
        fontWeight: '600',
        width: 'fit-content',
    },
    empty: { padding: '24px 20px', color: '#888', fontSize: '14px' },
    loading: { color: '#888', fontSize: '14px' },
    error: { color: '#c00', fontSize: '14px' },
}