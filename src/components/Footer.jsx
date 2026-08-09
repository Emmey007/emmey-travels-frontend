import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Footer = () => {
    const location = useLocation()
    const [hovered, setHovered] = useState(null)
    const [emailFocused, setEmailFocused] = useState(false)

    // Footer only appears on the login and register pages — everywhere
    // else it stays hidden
    const showFooter = location.pathname === '/login' || location.pathname === '/register'
    if (!showFooter) return null

    const columns = [
        {
            title: 'Travel',
            links: [
                { label: 'Flights', path: '/flights' },
                { label: 'Bus', path: '/bus' },
                { label: 'Ship Cruise', path: '/ship-cruise' },
                { label: 'Boat Cruise', path: '/boat-cruise' },
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Careers', path: '#' },
                { label: 'Press', path: '#' },
            ]
        },
        {
            title: 'Support',
            links: [
                { label: 'Help Center', path: '#' },
                { label: 'Booking Policy', path: '#' },
                { label: 'Refunds', path: '#' },
                { label: 'Safety', path: '#' },
            ]
        },
        {
            title: 'Account',
            links: [
                { label: 'Sign In', path: '/login' },
                { label: 'Register', path: '/register' },
                { label: 'My Bookings', path: '/bookings' },
                { label: 'Wishlist', path: '/wishlist' },
            ]
        },
    ]

    const socials = [
        { key: 'x', icon: 'fa-brands fa-x-twitter', href: '#' },
        { key: 'ig', icon: 'fa-brands fa-instagram', href: '#' },
        { key: 'fb', icon: 'fa-brands fa-facebook-f', href: '#' },
        { key: 'yt', icon: 'fa-brands fa-youtube', href: '#' },
    ]

    const bottomLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            />
            <footer style={styles.footer}>

                {/* CTA Banner */}
                <div style={styles.banner}>
                    <div style={styles.bannerInner}>
                        <div>
                            <h3 style={styles.bannerTitle}>Ready to explore the world?</h3>
                            <p style={styles.bannerSub}>Book flights, buses, cruises and more — all in one place.</p>
                        </div>
                        <Link
                            to="/register"
                            style={{ ...styles.bannerBtn, ...(hovered === 'cta' ? styles.bannerBtnHovered : {}) }}
                            onMouseEnter={() => setHovered('cta')}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Get started →
                        </Link>
                    </div>
                </div>

                {/* Main body */}
                <div style={styles.body}>
                    <div style={styles.brandCol}>
                        <Link to="/" style={styles.logo}>
                            <span style={styles.logoMain}>EMMEY</span>
                            <span style={styles.logoSub}>TRAVELS</span>
                        </Link>
                        <p style={styles.tagline}>
                            Connecting Africa to the world — and the world to Africa. Book with confidence, travel with ease.
                        </p>

                        <div style={styles.socials}>
                            {socials.map(({ key, icon, href }) => (
                                <a
                                    key={key}
                                    href={href}
                                    style={{ ...styles.social, ...(hovered === key ? styles.socialHovered : {}) }}
                                    onMouseEnter={() => setHovered(key)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <i className={icon}></i>
                                </a>
                            ))}
                        </div>

                        <div style={styles.newsletter}>
                            <p style={styles.newsletterLabel}>Get travel deals in your inbox</p>
                            <div style={styles.newsletterRow}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    style={{ ...styles.newsletterInput, ...(emailFocused ? styles.newsletterInputFocused : {}) }}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                />
                                <button style={styles.newsletterBtn}>Subscribe</button>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div style={styles.linkCols}>
                        {columns.map((col) => (
                            <div key={col.title} style={styles.col}>
                                <p style={styles.colTitle}>{col.title}</p>
                                {col.links.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        style={{ ...styles.colLink, ...(hovered === item.label ? styles.colLinkHovered : {}) }}
                                        onMouseEnter={() => setHovered(item.label)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={styles.bottom}>
                    <p style={styles.copy}>© {new Date().getFullYear()} EMMEY Travels. All rights reserved.</p>
                    <div style={styles.bottomLinks}>
                        {bottomLinks.map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={{ ...styles.bottomLink, ...(hovered === item ? styles.bottomLinkHovered : {}) }}
                                onMouseEnter={() => setHovered(item)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    )
}

const styles = {
  footer: {
    background: "#0a1628",
    color: "#fff",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },

  /* ================= Banner ================= */

  banner: {
    borderBottom: "1px solid #1a2f5e",
    padding: "32px 24px",
    background: "linear-gradient(135deg,#0a1628 0%,#122040 100%)",
  },

  bannerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },

  bannerTitle: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "6px",
  },

  bannerSub: {
    fontSize: "14px",
    color: "#8899bb",
  },

  bannerBtn: {
    padding: "12px 24px",
    background: "#c9a84c",
    color: "#0a1628",
    borderRadius: "8px",
    fontWeight: "700",
    textDecoration: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  bannerBtnHovered: {
    background: "#e8c96a",
    transform: "translateY(-2px)",
  },

  /* ================= Main Body ================= */

  body: {
    display: "flex",
    flexWrap: "wrap",
    gap: "48px",
    padding: "56px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  brandCol: {
    flex: "1 1 300px",
    minWidth: "280px",
  },

  logo: {
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    marginBottom: "16px",
  },

  logoMain: {
    color: "#c9a84c",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "4px",
  },

  logoSub: {
    color: "#8899bb",
    fontSize: "9px",
    letterSpacing: "4px",
    marginTop: "3px",
  },

  tagline: {
    color: "#8899bb",
    lineHeight: "1.7",
    marginBottom: "24px",
    fontSize: "13px",
  },

  socials: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "24px",
  },

  social: {
    width: "38px",
    height: "38px",
    border: "1px solid #1a2f5e",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8899bb",
    textDecoration: "none",
    transition: ".3s",
  },

  socialHovered: {
    border: "1px solid #c9a84c",
    color: "#c9a84c",
  },

  /* ================= Newsletter ================= */

  newsletterLabel: {
    color: "#8899bb",
    fontSize: "11px",
    marginBottom: "10px",
    textTransform: "uppercase",
  },

  newsletterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  newsletterInput: {
    flex: "1 1 200px",
    padding: "10px 14px",
    background: "#122040",
    color: "#fff",
    border: "1px solid #1a2f5e",
    borderRadius: "8px",
    outline: "none",
    fontSize: "13px",
  },

  newsletterInputFocused: {
    border: "1px solid #c9a84c",
  },

  newsletterBtn: {
    flex: "0 0 auto",
    padding: "10px 18px",
    background: "#c9a84c",
    color: "#0a1628",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  /* ================= Links ================= */

  linkCols: {
    flex: "2 1 600px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "24px",
  },

  col: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  colTitle: {
    color: "#c9a84c",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  colLink: {
    color: "#8899bb",
    textDecoration: "none",
    fontSize: "13px",
  },

  colLinkHovered: {
    color: "#fff",
  },

  /* ================= Bottom ================= */

  bottom: {
    borderTop: "1px solid #1a2f5e",
    padding: "20px 24px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  copy: {
    color: "#667799",
    fontSize: "12px",
  },

  bottomLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },

  bottomLink: {
    color: "#667799",
    textDecoration: "none",
    fontSize: "12px",
  },

  bottomLinkHovered: {
    color: "#c9a84c",
  },
};