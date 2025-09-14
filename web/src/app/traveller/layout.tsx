'use client';

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function TravellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['traveller']} requireAuth={true}>
      {children}
    </DashboardLayout>
  );
}
