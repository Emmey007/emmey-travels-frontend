import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { publicInstance } from '../api/axios'

export const Contact = () => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            setError('')
            await publicInstance.post('/enquiry', {
                name: data.name,
                email: data.email,
                message: data.message,
            })
            setSuccess(true)
            reset()
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.left}>
                    <h1 style={styles.title}>Get in touch</h1>
                    <p style={styles.sub}>Have a question about a destination, booking, or anything else? Our team is here to help.</p>

                    <div style={styles.infoList}>
                        <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>📧</span>
                            <div>
                                <p style={styles.infoLabel}>Email</p>
                                <p style={styles.infoValue}>support@emmytravels.com</p>
                            </div>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>📞</span>
                            <div>
                                <p style={styles.infoLabel}>Phone</p>
                                <p style={styles.infoValue}>+234 800 000 0000</p>
                            </div>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>🕐</span>
                            <div>
                                <p style={styles.infoLabel}>Response time</p>
                                <p style={styles.infoValue}>Within 24 hours</p>
                            </div>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>📍</span>
                            <div>
                                <p style={styles.infoLabel}>Based in</p>
                                <p style={styles.infoValue}>Lagos, Nigeria</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.right}>
                    <div style={styles.formCard}>
                        <h2 style={styles.formTitle}>Send us a message</h2>
                        <p style={styles.formSub}>We read every message and reply personally.</p>

                        {success && (
                            <div style={styles.successBox}>
                                <span style={styles.successIcon}>✅</span>
                                <div>
                                    <p style={styles.successTitle}>Message sent!</p>
                                    <p style={styles.successText}>We'll get back to you within 24 hours. Check your email for confirmation.</p>
                                </div>
                            </div>
                        )}

                        {error && <p style={styles.errorBox}>{error}</p>}

                        {!success && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Full name</label>
                                    <input
                                        style={styles.input}
                                        defaultValue={user?.name || ''}
                                        onFocus={e => e.target.style.borderColor = '#0a1628'}
                                        onBlur={e => e.target.style.borderColor = '#ddd'}
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                    {errors.name && <p style={styles.fieldError}>{errors.name.message}</p>}
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Email address</label>
                                    <input
                                        type="email"
                                        style={styles.input}
                                        defaultValue={user?.email || ''}
                                        onFocus={e => e.target.style.borderColor = '#0a1628'}
                                        onBlur={e => e.target.style.borderColor = '#ddd'}
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <p style={styles.fieldError}>{errors.email.message}</p>}
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Message</label>
                                    <textarea
                                        style={styles.textarea}
                                        placeholder="Tell us how we can help you..."
                                        onFocus={e => e.target.style.borderColor = '#0a1628'}
                                        onBlur={e => e.target.style.borderColor = '#ddd'}
                                        {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })}
                                    />
                                    {errors.message && <p style={styles.fieldError}>{errors.message.message}</p>}
                                </div>

                                <button type="submit" style={styles.btn} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send message →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        background: '#f9f9f9',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: '64px 0',
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '64px',
        alignItems: 'start',
    },
    left: {},
    title: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#0a1628',
        marginBottom: '16px',
        letterSpacing: '-0.5px',
    },
    sub: {
        fontSize: '15px',
        color: '#666',
        lineHeight: '1.7',
        marginBottom: '40px',
    },
    infoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
    },
    infoIcon: {
        fontSize: '24px',
        flexShrink: 0,
        marginTop: '2px',
    },
    infoLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '2px',
    },
    infoValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#0a1628',
    },
    right: {},
    formCard: {
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    formTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#0a1628',
        marginBottom: '6px',
        letterSpacing: '-0.3px',
    },
    formSub: {
        fontSize: '13px',
        color: '#888',
        marginBottom: '24px',
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        color: '#555',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        width: '100%',
        padding: '11px 13px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111',
        background: '#fff',
        transition: 'border-color 0.2s',
        fontFamily: "'Inter', sans-serif",
    },
    textarea: {
        width: '100%',
        padding: '11px 13px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111',
        background: '#fff',
        transition: 'border-color 0.2s',
        fontFamily: "'Inter', sans-serif",
        minHeight: '140px',
        resize: 'vertical',
    },
    fieldError: { color: '#c00', fontSize: '12px', marginTop: '4px' },
    btn: {
        width: '100%',
        padding: '13px',
        background: '#0a1628',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Inter', sans-serif",
        marginTop: '8px',
    },
    successBox: {
        background: '#f0faf0',
        border: '1px solid #c3e6c3',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '20px',
    },
    successIcon: { fontSize: '20px', flexShrink: 0 },
    successTitle: { fontSize: '14px', fontWeight: '700', color: '#2d7a2d', marginBottom: '4px' },
    successText: { fontSize: '13px', color: '#555', lineHeight: '1.6' },
    errorBox: {
        background: '#fff0f0',
        border: '1px solid #fcc',
        color: '#c00',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },
}