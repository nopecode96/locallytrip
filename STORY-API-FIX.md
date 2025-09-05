# Story API Route Fix - Production Issue Analysis

## Problem Summary
Production story detail pages at `https://locallytrip.com/stories/[slug]/` returned:
```json
{"success":false,"message":"fetch failed"}
```

## Root Cause Analysis

### 1. **Incorrect Backend URL Configuration**
- **File**: `web/src/app/api/stories/[slug]/route.ts`
- **Issue**: Hardcoded backend URL instead of using environment-aware utility
- **Previous Code**: 
  ```typescript
  const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  ```

### 2. **Inconsistent Backend URL Pattern**
- **Other API routes**: Used `getServerBackendUrl()` utility function
- **Story route**: Used manual environment variable logic
- **Problem**: Different approaches leading to inconsistent behavior

## Solution Implemented

### ✅ Fixed Backend URL Resolution
**Changed**: 
```typescript
// OLD - Manual environment handling
const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

// NEW - Consistent utility function
import { getServerBackendUrl } from '@/utils/serverBackend';
const backendUrl = getServerBackendUrl();
```

### ✅ Verified Backend Endpoint
**Backend endpoint**: `/stories/slug/[slug]` (without `/api/v1/` prefix)
**Test result**: 
```bash
curl http://localhost:3001/stories/slug/jakarta-street-food
# Returns: Full story data with 200 OK
```

## Testing Results

### Before Fix
```bash
curl https://locallytrip.com/api/stories/jakarta-street-food/
# HTTP 500 - {"success":false,"message":"fetch failed"}
```

### After Fix (Local Test)
```bash
curl http://localhost:3000/api/stories/jakarta-street-food/
# HTTP 200 - {"success":true,"data":{...story data...}}
```

## Key Learnings

1. **Consistency**: All API routes should use `getServerBackendUrl()` utility
2. **Environment Variables**: 
   - `INTERNAL_API_URL`: For server-side container communication
   - `NEXT_PUBLIC_API_URL`: For client-side and fallback
3. **Backend Endpoint Structure**: Stories use `/stories/slug/[slug]` not `/api/v1/stories/slug/[slug]`

## Files Modified
- `web/src/app/api/stories/[slug]/route.ts` - Fixed backend URL resolution

## Production Deployment Required
This fix needs to be deployed to production server to resolve the issue.

---
**Date**: September 3, 2025  
**Status**: ✅ Fixed & Committed  
**Commit**: `7006ece` - Fix story API route backend URL handling
