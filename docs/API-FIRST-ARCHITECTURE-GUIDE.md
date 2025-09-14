# API-First Data Architecture Implementation Guide

## Overview
Migrasi dari session-based ke API-first approach untuk konsistensi data yang lebih baik.

## Keuntungan Pendekatan API-First

### 1. **Data Consistency**
- Selalu mendapat data terbaru dari database
- Tidak ada cache stale data di client
- Real-time updates langsung terlihat

### 2. **Simplified State Management**
- Minimal localStorage usage (hanya token)
- Single source of truth dari backend
- Easier debugging dan troubleshooting

### 3. **Better Performance**
- Conditional fetching dengan proper cache headers
- Optimistic updates untuk UI responsiveness
- Background refresh capabilities

## Implementation Strategy

### Phase 1: Create New Hooks
✅ `useUserProfile` - General user data fetching
✅ `useProfilePage` - Profile page specific operations
✅ `AuthContextNew` - Updated auth context

### Phase 2: Backend Optimizations

#### 2.1 Enhanced Profile Endpoint
```javascript
// backend/src/controllers/authController.js
getProfile: async (req, res) => {
  try {
    // Add conditional fetching based on lastModified
    const ifModifiedSince = req.headers['if-modified-since'];
    
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name', 'country_id']
        },
        {
          model: HostCategory,
          as: 'hostCategories',
          attributes: ['id', 'name', 'description', 'icon'],
          through: {
            attributes: ['isPrimary', 'isActive']
          }
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if data was modified since last request
    const lastModified = user.updatedAt;
    if (ifModifiedSince && new Date(ifModifiedSince) >= lastModified) {
      return res.status(304).end(); // Not Modified
    }

    // Set cache headers
    res.set({
      'Last-Modified': lastModified.toUTCString(),
      'Cache-Control': 'private, max-age=0, must-revalidate',
      'ETag': `"${user.id}-${lastModified.getTime()}"`
    });

    res.json({
      success: true,
      data: user,
      lastModified: lastModified
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
}
```

#### 2.2 Real-time Update Notifications
```javascript
// Add to all update operations
const notifyUserUpdate = (userId) => {
  // Emit socket event for real-time updates (if using Socket.IO)
  if (io) {
    io.to(`user_${userId}`).emit('profile_updated');
  }
};

// In updateProfile, uploadAvatar, etc.
await user.update(updateData);
notifyUserUpdate(user.id);
```

### Phase 3: Frontend Implementation

#### 3.1 Enhanced Caching Hook
```typescript
// hooks/useUserProfileWithCache.ts
import { useState, useEffect, useRef } from 'react';

export const useUserProfileWithCache = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const lastModifiedRef = useRef<string | null>(null);

  const fetchUser = async (force = false) => {
    try {
      const headers: HeadersInit = {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      };

      // Add conditional headers for caching
      if (!force && lastModifiedRef.current) {
        headers['If-Modified-Since'] = lastModifiedRef.current;
      }

      const response = await fetch('/api/auth/profile', { headers });

      if (response.status === 304) {
        // Not modified, use cached data
        setLoading(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        lastModifiedRef.current = response.headers.get('Last-Modified');
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, refresh: () => fetchUser(true) };
};
```

#### 3.2 Optimistic Updates
```typescript
// hooks/useOptimisticProfile.ts
export const useOptimisticProfile = () => {
  const { user, refresh } = useUserProfile();
  const [optimisticUser, setOptimisticUser] = useState(user);

  const updateProfileOptimistic = async (updates: Partial<User>) => {
    // Immediately update UI
    setOptimisticUser(prev => prev ? { ...prev, ...updates } : null);

    try {
      // Send to server
      const result = await updateProfile(updates);
      
      if (result.success) {
        // Refresh from server to get canonical data
        await refresh();
      } else {
        // Revert optimistic update
        setOptimisticUser(user);
        throw new Error(result.message);
      }
    } catch (error) {
      // Revert on error
      setOptimisticUser(user);
      throw error;
    }
  };

  return {
    user: optimisticUser,
    updateProfileOptimistic
  };
};
```

### Phase 4: Migration Strategy

#### 4.1 Gradual Migration
1. **Week 1**: Implement new hooks alongside existing system
2. **Week 2**: Migrate profile page to new hooks
3. **Week 3**: Migrate navigation components
4. **Week 4**: Remove old AuthContext, cleanup

#### 4.2 Feature Flags
```typescript
// utils/featureFlags.ts
export const useAPIFirst = () => {
  return process.env.NEXT_PUBLIC_USE_API_FIRST === 'true';
};

// In components
const Component = () => {
  const apiFirst = useAPIFirst();
  
  if (apiFirst) {
    return <NewAPIFirstComponent />;
  }
  return <LegacyComponent />;
};
```

## Benefits Verification

### Before (Session-based)
```typescript
// ❌ Potential data inconsistency
const user = JSON.parse(localStorage.getItem('user_data')); // Stale data
```

### After (API-first)
```typescript
// ✅ Always fresh data
const { user, loading, refresh } = useUserProfile(); // Live data from API
```

## Performance Considerations

1. **Caching Strategy**: Use HTTP caching headers
2. **Background Refresh**: Fetch data on window focus
3. **Optimistic Updates**: Immediate UI feedback
4. **Error Handling**: Graceful fallbacks and retry logic

## Monitoring & Analytics

```typescript
// Track API usage and performance
const trackAPICall = (endpoint: string, duration: number, success: boolean) => {
  analytics.track('api_call', {
    endpoint,
    duration,
    success,
    timestamp: Date.now()
  });
};
```

## Rollback Strategy

1. Keep old AuthContext as backup
2. Feature flag for quick toggle
3. Database-level compatibility maintained
4. Client-side fallback mechanisms

Implementasi ini akan memberikan:
- ✅ Data consistency yang lebih baik
- ✅ Real-time updates
- ✅ Simplified debugging
- ✅ Better user experience
- ✅ Easier maintenance
