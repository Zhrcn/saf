'use client';

import { 
    Home, Calendar, FileText, Pill, 
    MessageSquare, Settings, Bell, LogOut 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/pharmacist'
    },
    {
        name: 'Prescriptions',
        icon: Pill,
        link: '/pharmacist/prescriptions'
    },
    {
        name: 'Inventory',
        icon: FileText,
        link: '/pharmacist/inventory'
    },
    {
        name: 'Orders',
        icon: Calendar,
        link: '/pharmacist/orders'
    },
    {
        name: 'Messages',
        icon: MessageSquare,
        link: '/pharmacist/messages'
    },
    {
        name: 'Settings',
        icon: Settings,
        link: '/pharmacist/settings'
    }
];

export default function PharmacistLayout({ children }) {
    return (
        <AppLayout
            title="Pharmacist Portal"
            sidebarItems={sidebarItems}
            allowedRoles={['pharmacist']}
        >
            {children}
        </AppLayout>
    );
} 