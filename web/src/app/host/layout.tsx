'use client';

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['host']} requireAuth={true}>
      {children}
    </DashboardLayout>
  );
}
