# AuthGuard System - LocallyTrip Admin

Sistem AuthGuard untuk proteksi halaman admin dengan role-based access control.

## 🛡️ Komponen Utama

### 1. **AuthGuard Component**
Komponen wrapper untuk proteksi halaman dengan authentication dan role checking.

```tsx
import AuthGuard from '@/components/AuthGuard';

// Basic usage - hanya memerlukan login
<AuthGuard>
  <YourPageContent />
</AuthGuard>

// Dengan role restrictions
<AuthGuard requiredRoles={['super_admin', 'admin']}>
  <AdminOnlyContent />
</AuthGuard>

// Custom redirect path
<AuthGuard fallbackPath="/custom-login">
  <ProtectedContent />
</AuthGuard>
```

### 2. **Higher-Order Components (HOCs)**
Pre-built HOCs untuk role-specific protections.

```tsx
import { 
  withSuperAdminOnly,
  withAdminOrAbove,
  withFinanceAccess,
  withMarketingAccess,
  withModeratorAccess,
  withAnyAdminRole 
} from '@/components/withAuthGuard';

// Contoh penggunaan
const SuperAdminPage = () => { /* content */ };
export default withSuperAdminOnly(SuperAdminPage);

const FinancePage = () => { /* content */ };
export default withFinanceAccess(FinancePage);
```

## 🎯 Role Hierarchy

| Role | Access Level | Description |
|------|--------------|-------------|
| `super_admin` | Full access | Complete system control |
| `admin` | High access | Most admin functions |
| `finance` | Finance only | Financial data and reports |
| `marketing` | Marketing only | Marketing campaigns and analytics |
| `moderator` | Moderation only | Content moderation |

## 📋 Usage Examples

### Method 1: Component Wrapper
```tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { useAdminAuth } from '@/contexts/AdminContext';

const DashboardPage = () => {
  const { user } = useAdminAuth();
  
  if (!user) return null; // TypeScript safety

  return (
    <AuthGuard>
      <div>Your dashboard content</div>
    </AuthGuard>
  );
};
```

### Method 2: HOC Pattern
```tsx
'use client';

import { withAdminOrAbove } from '@/components/withAuthGuard';

const AdminPage = () => {
  return <div>Admin only content</div>;
};

export default withAdminOrAbove(AdminPage);
```

### Method 3: Role-Specific HOCs
```tsx
// Finance-only page
import { withFinanceAccess } from '@/components/withAuthGuard';

const FinanceReports = () => {
  return <div>Finance reports</div>;
};

export default withFinanceAccess(FinanceReports);
```

## 🔧 Permission Utilities

```tsx
import { 
  checkPermission,
  hasFinanceAccess,
  hasMarketingAccess,
  hasModeratorAccess,
  isSuperAdmin,
  isAdmin 
} from '@/components/withAuthGuard';

// Check specific permissions
const canViewFinance = hasFinanceAccess(user.role);
const isUserAdmin = isAdmin(user.role);

// Custom permission check
const canEditUsers = checkPermission(user.role, ['super_admin', 'admin']);
```

## 🚀 Features

### ✅ Automatic Redirects
- **Unauthenticated users** → redirected to `/login`
- **Insufficient permissions** → redirected to `/unauthorized`
- **Custom fallback paths** supported

### ✅ Loading States
- Shows loading spinner during authentication check
- Prevents flash of unauthorized content
- Smooth user experience

### ✅ TypeScript Safety
- Full type checking for roles and permissions
- IntelliSense support for role names
- Compile-time error detection

### ✅ Flexible Implementation
- Component wrapper pattern
- HOC pattern
- Utility functions for inline checks

## 🎨 Styling Loading States

The AuthGuard shows a consistent loading spinner:

```tsx
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    <p className="mt-4 text-gray-600">Authenticating...</p>
  </div>
</div>
```

## 🔒 Security Best Practices

1. **Always use null checks** after AuthGuard (TypeScript requirement)
2. **Prefer HOCs for page-level protection**
3. **Use component wrapper for conditional content**
4. **Check permissions on backend as well** (never trust frontend only)
5. **Use specific role arrays** instead of broad access

## 📁 File Structure

```
web-admin/src/
├── components/
│   ├── AuthGuard.tsx           # Main AuthGuard component
│   └── withAuthGuard.tsx       # HOCs and utilities
├── app/
│   ├── dashboard/page.tsx      # Protected with AuthGuard
│   ├── finance/page.tsx        # Finance role only
│   ├── reports/page.tsx        # HOC example
│   └── unauthorized/page.tsx   # Fallback page
└── contexts/
    └── AdminContext.tsx        # Auth state management
```

## 🧪 Testing

Test AuthGuard by:
1. **Accessing protected pages without login** → should redirect to login
2. **Accessing role-restricted pages** → should redirect to unauthorized
3. **Valid access with correct role** → should render content
4. **Logout functionality** → should clear state and redirect

This system ensures all admin pages are properly protected with minimal code duplication.
