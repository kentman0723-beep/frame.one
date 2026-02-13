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
        <div className="min-h-screen bg-void bg-grid flex flex-col">
            {/* ======== Header ======== */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
                style={{ borderRadius: 0 }}
            >
                <div className="flex items-center justify-between px-6 md:px-10 h-20">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <Zap className="w-8 h-8 text-cyan" />
                            <div className="absolute inset-0 blur-lg bg-cyan/30 group-hover:bg-cyan/50 transition-all" />
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-bold tracking-wider text-text">
                                FRAME<span className="text-cyan">.</span><span className="text-magenta">ONE</span>
                            </h1>
                        </div>
                    </NavLink>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${isActive
                                        ? 'bg-cyan/10 text-cyan glow-cyan'
                                        : 'text-text-dim hover:text-text hover:bg-glass-hover'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-2 rounded-lg text-text-dim hover:text-text hover:bg-glass-hover transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/5 border border-cyan/20">
                            <Swords className="w-4 h-4 text-cyan" />
                            <span className="text-sm font-medium text-cyan">Starter Plan</span>
                        </div>
                    </div>
                </div>
            </header >

            {/* ======== Mobile Sidebar ======== */}
            <AnimatePresence>
                {
                    sidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <motion.aside
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed left-0 top-0 bottom-0 w-[280px] z-50 glass-card border-r border-glass-border md:hidden"
                                style={{ borderRadius: 0 }}
                            >
                                <div className="p-6 pt-20">
                                    <nav className="flex flex-col gap-1">
                                        {navItems.map(item => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setSidebarOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                        ? 'bg-cyan/10 text-cyan glow-cyan'
                                                        : 'text-text-dim hover:text-text hover:bg-glass-hover'
                                                    }`
                                                }
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            </motion.aside>
                        </>
                    )
                }
            </AnimatePresence >

            {/* ======== Main Content ======== */}
            < main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-16 max-w-[1440px] mx-auto w-full" >
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
            </main >

            {/* ======== Footer ======== */}
            < LegalFooter />
        </div >
    );
}
