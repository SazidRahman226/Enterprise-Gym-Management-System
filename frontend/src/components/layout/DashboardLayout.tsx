import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Footer } from './Footer';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Calendar,
    Settings,
    LogOut,
    Menu,
    CreditCard,
    FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
    return (
        <Link
            to={href}
            onClick={onClick}
            className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                active
                    ? "bg-primary-50 text-primary-700"
                    : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
            )}
        >
            <Icon className="mr-3 h-5 w-5" />
            {label}
        </Link>
    );
};

export function DashboardLayout({ role = 'member' }: { role?: 'member' | 'admin' | 'trainer' }) {
    const { logout, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const memberLinks = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/member' },
        { icon: CreditCard, label: 'Purchase Plan', href: '/dashboard/member/purchase' },
        { icon: Calendar, label: 'Class Schedule', href: '/dashboard/member/schedule' },
        { icon: FileText, label: 'Attendance', href: '/dashboard/member/attendance' },
        { icon: Settings, label: 'Profile', href: '/dashboard/member/profile' },
    ];

    const adminLinks = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/admin' },
        { icon: Users, label: 'Members', href: '/dashboard/admin/members' },
        { icon: Dumbbell, label: 'Trainers', href: '/dashboard/admin/trainers' },
        { icon: Settings, label: 'Equipment', href: '/dashboard/admin/equipment' },
    ];

    const trainerLinks = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/trainer' },
        { icon: Calendar, label: 'Schedule', href: '/dashboard/trainer/schedule' },
        { icon: Settings, label: 'Profile', href: '/dashboard/trainer/profile' },
    ];

    const links = role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : memberLinks;

    return (
        <div className="min-h-screen bg-primary-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-primary-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center border-b border-primary-200 px-6">
                    <Dumbbell className="h-6 w-6 text-primary-600" />
                    <span className="ml-2 text-lg font-bold text-primary-900">FitMinds</span>
                </div>

                <div className="flex flex-col flex-grow px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {links.map((link) => (
                        <SidebarItem
                            key={link.href}
                            icon={link.icon}
                            label={link.label}
                            href={link.href}
                            active={location.pathname === link.href}
                            onClick={() => setSidebarOpen(false)}
                        />
                    ))}

                    <div className="mt-auto pt-6 border-t border-primary-200">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                logout();
                                window.location.href = '/';
                            }}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-primary-200 bg-white px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-primary-500 hover:text-primary-700 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center ml-auto space-x-4">
                        <span className="text-sm font-medium text-primary-700 hidden md:block">{user?.name}</span>
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
