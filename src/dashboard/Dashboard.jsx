import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Dashboard = () => {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [hovered, setHovered] = useState(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navLinks = [
        { label: 'Overview', path: '/dashboard' },
        { label: 'Manage Bookings', path: '/dashboard/bookings' },
        { label: 'Manage Listings', path: '/dashboard/listings' },
        { label: 'Manage Users', path: '/dashboard/users' },
        { label: 'Enquiries', path: '/dashboard/enquiries' },
        { label: 'Add Listing', path: '/dashboard/add-listing' },
    ]

    const isActive = (path) => {
        if (path === '/dashboard') return location.pathname === '/dashboard'
        return location.pathname.startsWith(path)
    }

    return (
        <div style={styles.page}>
            <aside style={styles.sidebar}>
                <div style={styles.sidebarTop}>
                    <Link to="/" style={styles.logo}>
                        <span style={styles.logoMain}>EMMEY</span>
                        <span style={styles.logoSub}>TRAVELS</span>
                    </Link>
                    {user && (
                        <div style={styles.userBox}>
                            <div style={styles.avatar}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={styles.userName}>{user.name}</p>
                                <p style={styles.userRole}>{user.role}</p>
                            </div>
                        </div>
                    )}
                </div>

                <nav style={styles.nav}>
                    {navLinks.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                ...styles.navLink,
                                ...(isActive(item.path) ? styles.navLinkActive : {}),
                                ...(hovered === item.path && !isActive(item.path) ? styles.navLinkHovered : {})
                            }}
                            onMouseEnter={() => setHovered(item.path)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={styles.sidebarBottom}>
                    <Link to="/" style={styles.backLink}>← Back to site</Link>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </aside>

            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}

const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        background: '#f9f9f9',
    },
    sidebar: {
        width: '220px',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
    },
    sidebarTop: {
        padding: '24px 20px',
        borderBottom: '1px solid #222',
    },
    logo: {
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
    },
    logoMain: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#fff',
        letterSpacing: '2px',
        lineHeight: 1,
    },
    logoSub: {
        fontSize: '10px',
        fontWeight: '600',
        color: '#666',
        letterSpacing: '3px',
    },
    userBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#fff',
        color: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '13px',
        flexShrink: 0,
    },
    userName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#fff',
        margin: 0,
    },
    userRole: {
        fontSize: '11px',
        color: '#666',
        margin: 0,
        textTransform: 'capitalize',
    },
    nav: {
        flex: 1,
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
    },
    navLink: {
        color: '#888',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        padding: '10px 20px',
        transition: 'all 0.15s',
        borderLeft: '2px solid transparent',
    },
    navLinkHovered: {
        color: '#ccc',
        background: '#1a1a1a',
    },
    navLinkActive: {
        color: '#fff',
        background: '#1a1a1a',
        borderLeft: '2px solid #fff',
    },
    sidebarBottom: {
        padding: '16px 20px',
        borderTop: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    backLink: {
        color: '#666',
        textDecoration: 'none',
        fontSize: '12px',
        transition: 'color 0.15s',
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid #333',
        color: '#888',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.15s',
        textAlign: 'left',
    },
    main: {
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
    },
}