import { useState, useEffect } from 'react'
import { privateInstance } from '../api/axios'
import { Link } from 'react-router-dom'

export const Bookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [printBooking, setPrintBooking] = useState(null)

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const res = await privateInstance.get('/booking/my-bookings')
            setBookings(res.data.bookings || [])
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchBookings() }, [])

    // Trigger the browser print dialog once the printable receipt has
    // rendered, and clear it once the dialog closes (cancel or print)
    useEffect(() => {
        if (!printBooking) return
        const timer = setTimeout(() => window.print(), 100)
        const handleAfterPrint = () => setPrintBooking(null)
        window.addEventListener('afterprint', handleAfterPrint)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('afterprint', handleAfterPrint)
        }
    }, [printBooking])

    const getBadgeStyle = (status) => {
        if (status === 'confirmed') return { background: '#f0faf0', color: '#2d7a2d' }
        if (status === 'pending') return { background: '#fff8e6', color: '#b06d00' }
        if (status === 'cancelled') return { background: '#fff0f0', color: '#c00' }
        return {}
    }

    return (
        <div style={styles.page}>
            {/* Inline styles above always win over plain CSS, so these
                overrides use !important to take over at smaller breakpoints */}
            <style>{`
                @media (max-width: 700px) {
                    .bookings-container {
                        padding: 32px 16px !important;
                    }
                    .booking-card {
                        flex-direction: column !important;
                    }
                    .booking-img {
                        width: 100% !important;
                        height: 180px !important;
                    }
                    .booking-card-top {
                        flex-wrap: wrap !important;
                        gap: 8px !important;
                    }
                    .booking-details {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }

                @media (max-width: 420px) {
                    .booking-details {
                        grid-template-columns: 1fr !important;
                    }
                }

                /* Printing — hide everything except the receipt overlay */
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-receipt, .print-receipt * {
                        visibility: visible;
                    }
                    .print-receipt {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        margin: 0;
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Printable receipt — only meaningfully visible during print,
                shown as an on-screen preview overlay beforehand */}
            {printBooking && (
                <div style={styles.printOverlay}>
                    <div style={styles.printReceipt} className="print-receipt">
                        <div style={styles.receiptHeader}>
                            <p style={styles.receiptBrand}>EMMEY TRAVELS</p>
                            <p style={styles.receiptSub}>Booking Receipt</p>
                        </div>

                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Reference</span>
                            <span style={styles.receiptValue}>{printBooking.reference}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Route</span>
                            <span style={styles.receiptValue}>
                                {printBooking.listing
                                    ? `${printBooking.listing.origin} → ${printBooking.listing.destination}`
                                    : 'Custom Booking'}
                            </span>
                        </div>
                        {printBooking.listing && (
                            <div style={styles.receiptRow}>
                                <span style={styles.receiptLabel}>Travel Type</span>
                                <span style={styles.receiptValue}>{printBooking.listing.type}</span>
                            </div>
                        )}
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Occasion</span>
                            <span style={styles.receiptValue}>{printBooking.occasion || 'N/A'}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Seats</span>
                            <span style={styles.receiptValue}>{printBooking.seats}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Total Paid</span>
                            <span style={styles.receiptValue}>₦{printBooking.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Payment Status</span>
                            <span style={styles.receiptValue}>{printBooking.paymentStatus}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Booking Status</span>
                            <span style={styles.receiptValue}>{printBooking.status}</span>
                        </div>
                        <div style={styles.receiptRow}>
                            <span style={styles.receiptLabel}>Booked On</span>
                            <span style={styles.receiptValue}>{new Date(printBooking.createdAt).toDateString()}</span>
                        </div>

                        {printBooking.passengers?.length > 0 && (
                            <div style={styles.receiptPassengers}>
                                <p style={styles.receiptPassengersTitle}>Passengers</p>
                                {printBooking.passengers.map((p, i) => (
                                    <p key={i} style={styles.receiptPassengerLine}>
                                        {i + 1}. {p.name} {p.passportNumber ? `· ${p.passportNumber}` : ''}
                                    </p>
                                ))}
                            </div>
                        )}

                        <p style={styles.receiptFooter}>
                            Thank you for booking with EMMEY Travels. Safe travels!
                        </p>

                        <button
                            style={styles.printCancelBtn}
                            className="no-print"
                            onClick={() => setPrintBooking(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div style={styles.container} className="bookings-container">
                <h1 style={styles.title}>My Bookings</h1>
                <p style={styles.sub}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>

                {loading && <p style={styles.loading}>Loading your bookings...</p>}
                {error && <p style={styles.error}>{error}</p>}

                {!loading && bookings.length === 0 && (
                    <div style={styles.empty}>
                        <p style={styles.emptyIcon}>🧳</p>
                        <p style={styles.emptyTitle}>No bookings yet</p>
                        <p style={styles.emptyText}>You haven't booked any trips yet. Start exploring!</p>
                        <Link to="/" style={styles.exploreBtn}>Explore Destinations</Link>
                    </div>
                )}

                <div style={styles.list}>
                    {bookings.map((booking) => (
                        <div key={booking._id} style={styles.card} className="booking-card">
                            {booking.listing?.image && (
                                <img
                                    src={booking.listing.image}
                                    alt={booking.listing.title}
                                    style={styles.img}
                                    className="booking-img"
                                />
                            )}
                            <div style={styles.cardBody}>
                                <div style={styles.cardTop} className="booking-card-top">
                                    <div>
                                        <p style={styles.ref}>{booking.reference}</p>
                                        <h3 style={styles.destination}>
                                            {booking.listing
                                                ? `${booking.listing.origin} → ${booking.listing.destination}`
                                                : 'Custom Booking'
                                            }
                                        </h3>
                                        {booking.listing && (
                                            <p style={styles.type}>{booking.listing.type} · {booking.listing.continent}</p>
                                        )}
                                    </div>
                                    <span style={{ ...styles.badge, ...getBadgeStyle(booking.status) }}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div style={styles.details} className="booking-details">
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Occasion</span>
                                        <span style={styles.detailValue}>{booking.occasion || 'N/A'}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Seats</span>
                                        <span style={styles.detailValue}>{booking.seats}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Total</span>
                                        <span style={styles.detailValue}>₦{booking.totalPrice?.toLocaleString()}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Payment</span>
                                        <span style={{ ...styles.detailValue, color: booking.paymentStatus === 'paid' ? '#2d7a2d' : '#b06d00' }}>
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                    {booking.listing?.departureDate && (
                                        <div style={styles.detailItem}>
                                            <span style={styles.detailLabel}>Departure</span>
                                            <span style={styles.detailValue}>{new Date(booking.listing.departureDate).toDateString()}</span>
                                        </div>
                                    )}
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Booked On</span>
                                        <span style={styles.detailValue}>{new Date(booking.createdAt).toDateString()}</span>
                                    </div>
                                </div>

                                {booking.passengers?.length > 0 && (
                                    <div style={styles.passengers}>
                                        <p style={styles.passengersTitle}>Passengers</p>
                                        {booking.passengers.map((p, i) => (
                                            <p key={i} style={styles.passengerName}>
                                                {i + 1}. {p.name} {p.passportNumber ? `· ${p.passportNumber}` : ''}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <button
                                    style={styles.printBtn}
                                    onClick={() => setPrintBooking(booking)}
                                >
                                    🖨️ Print booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { background: '#f9f9f9', minHeight: '100vh', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
    container: { maxWidth: '900px', margin: '0 auto', padding: '48px 24px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#111', marginBottom: '4px', letterSpacing: '-0.5px' },
    sub: { fontSize: '14px', color: '#888', marginBottom: '32px' },
    loading: { color: '#888', fontSize: '14px' },
    error: { color: '#c00', fontSize: '14px' },
    empty: { textAlign: 'center', padding: '80px 0' },
    emptyIcon: { fontSize: '56px', marginBottom: '16px' },
    emptyTitle: { fontSize: '20px', fontWeight: '800', color: '#111', marginBottom: '8px' },
    emptyText: { fontSize: '14px', color: '#888', marginBottom: '24px' },
    exploreBtn: { display: 'inline-block', padding: '12px 28px', background: '#0a1628', color: '#fff', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' },
    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { background: '#fff', border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex' },
    img: { width: '200px', height: '200px', objectFit: 'cover', flexShrink: 0 },
    cardBody: { padding: '24px', flex: 1 },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    ref: { fontSize: '11px', fontWeight: '700', color: '#c9a84c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' },
    destination: { fontSize: '18px', fontWeight: '800', color: '#0a1628', marginBottom: '4px' },
    type: { fontSize: '12px', color: '#888', textTransform: 'capitalize' },
    badge: { fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', textTransform: 'capitalize', flexShrink: 0 },
    details: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', background: '#f9f9f9', borderRadius: '10px', padding: '16px' },
    detailItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
    detailLabel: { fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
    detailValue: { fontSize: '13px', fontWeight: '700', color: '#111' },
    passengers: { borderTop: '1px solid #eee', paddingTop: '12px' },
    passengersTitle: { fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
    passengerName: { fontSize: '13px', color: '#333', marginBottom: '4px' },

    printBtn: {
        marginTop: '16px',
        width: '100%',
        padding: '10px',
        background: '#fff',
        color: '#0a1628',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    printOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(10,22,40,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '24px',
    },
    printReceipt: {
        background: '#fff',
        borderRadius: '16px',
        padding: '36px',
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
    },
    receiptHeader: {
        textAlign: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #0a1628',
    },
    receiptBrand: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#0a1628',
        letterSpacing: '3px',
        marginBottom: '4px',
    },
    receiptSub: {
        fontSize: '12px',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    receiptRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #f5f5f5',
        fontSize: '13px',
    },
    receiptLabel: { color: '#888', fontWeight: '600' },
    receiptValue: { color: '#111', fontWeight: '700', textTransform: 'capitalize' },
    receiptPassengers: { marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #eee' },
    receiptPassengersTitle: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
    },
    receiptPassengerLine: { fontSize: '13px', color: '#333', marginBottom: '4px' },
    receiptFooter: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    printCancelBtn: {
        marginTop: '20px',
        width: '100%',
        padding: '11px',
        background: '#f5f5f5',
        color: '#111',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
    },
}