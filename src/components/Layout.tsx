import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Settings,
    CreditCard,
    Menu,
    X,
    Swords,
    Zap,
} from 'lucide-react';
import LegalFooter from './LegalFooter';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/config', label: 'Game Config', icon: Settings },
    { path: '/pricing', label: 'Plans', icon: CreditCard },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="app-container">
            {/* ======== Header ======== */}
            <header className="app-header">
                {/* Logo */}
                <NavLink to="/" className="logo-link">
                    <div className="logo-icon-wrap">
                        <Zap size={28} color="var(--cyan)" />
                        <div className="logo-icon-glow" />
                    </div>
                    <span className="logo-text">
                        FRAME<span className="logo-dot">.</span><span className="logo-one">ONE</span>
                    </span>
                </NavLink>

                {/* Desktop Nav - hidden on mobile via CSS */}
                <nav className="desktop-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Mobile Toggle - shown on mobile via CSS */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mobile-toggle"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Plan Badge - hidden on mobile via CSS */}
                <div className="plan-badge desktop-only">
                    <Swords size={16} color="var(--cyan)" />
                    Starter Plan
                </div>
            </header>

            {/* ======== Mobile Sidebar ======== */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="sidebar-overlay"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="sidebar-panel"
                        >
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {navItems.map(item => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `sidebar-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ======== Main Content ======== */}
            <main className="app-main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ======== Footer ======== */}
            <LegalFooter />
        </div>
    );
}
