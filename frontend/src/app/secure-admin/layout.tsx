import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import AdminLayoutClient from './admin-layout-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School Admin Portal',
  description: 'Secure Content Management System',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
