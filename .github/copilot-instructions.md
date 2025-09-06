<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# LocallyTrip.com Development Guidelines

## Project Overview
LocallyTrip.com is a microservices travel discovery platform with Docker-orchestrated services:
- **Backend**: Node.js/Express API (port 3001) with PostgreSQL + Sequelize ORM
- **Web Frontend**: Next.js 14 App Router (port 3000) - traveller-facing site  
- **Admin Dashboard**: Next.js 14 App Router (port 3002) - content management
- **Mobile App**: Flutter with Provider state management
- **Database**: PostgreSQL 15 with comprehensive relational schema
- **Infrastructure**: Docker Compose with persistent volumes and bridge networking

## Critical Development Patterns

### API Integration & Data Flow
**Frontend uses API proxy pattern** - Next.js API routes in `/src/app/api/` proxy to backend:
```typescript
// Example: /web/src/app/api/hosts/[id]/route.ts
const backendUrl = process.env.NEXT_PUBLIC_API_URL;
const response = await fetch(`${backendUrl}/hosts/${hostId}`);
```

**Custom React hooks for data fetching** - consistent pattern across components:
```typescript
// Pattern: /web/src/hooks/useHost.ts, useStories.ts, useFAQs.ts
export const useHost = (hostId: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Always fetch from /api/* routes, not backend directly
  const response = await fetch(`/api/hosts/${hostId}`);
};
```

### Database Architecture & Models
**Sequelize relationships are complex** - pay attention to association aliases:
```javascript
// In backend/src/models/index.js - aliases must match frontend expectations
User.belongsTo(City, { foreignKey: 'cityId', as: 'City' }); // Capital C
User.hasMany(Experience, { foreignKey: 'hostId', as: 'hostedExperiences' });
```

**Static data fallbacks** - when backend DB issues occur, frontend uses static data:
```typescript
// Pattern in API routes like /api/hosts/[id]/route.ts
const STATIC_HOSTS: Record<string, Host> = {
  'host-1': { /* complete host object */ }
};
```

### Image Management System
**Centralized ImageService** handles all image URLs:
```typescript
// /web/src/services/imageService.ts
export class ImageService {
  static getImageUrl(imagePath: string): string {
    return `http://localhost:3001${imagePath}`;  // Always route through backend
  }
}
```

**Backend serves static files** with placeholder fallbacks:
```javascript
// backend/src/server.js
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/images', placeholderMiddleware); // Fallback for missing images
```

## Essential Commands & Workflows

### Development Environment
```bash
# Start full stack (preferred)
docker compose up --build

# Access services
# Web: http://localhost:3000, Admin: http://localhost:3002, API: http://localhost:3001

# Database operations  
./seed-database-complete.sh  # Populate with complete sample data
docker logs locallytrip-backend  # Debug API issues
docker logs locallytrip-web     # Debug frontend issues
```

### Mobile Development (Flutter)
```bash
cd mobile/
flutter pub get
flutter run  # Requires simulator/device
# API base URL: AppConstants.apiUrl = 'http://localhost:3001/api/v1'
```

### Database Schema & Seeding
**Complex relational schema** - key tables and relationships:
- `users` (hosts/travellers) → `cities` → `countries` 
- `experiences` → `host_categories`, linked to `users` as hosts
- `stories` with `author` relationship to `users`
- `bookings` connecting `users` and `experiences`

**Seeding process** - multi-stage with dependencies:
```bash
# Located in backend/db/seed/ - runs in order:
# 01-seed-basic-data.sql (users, cities, categories)
# 02-seed-complex-data.sql (experiences, bookings, reviews)
```

## Key Integration Points

### Frontend-Backend Communication
**Consistent response format** across all API endpoints:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional message",
  "pagination": { /* if applicable */ }
}
```

**Error handling pattern** - frontend hooks expect this structure:
```typescript
if (data.success) {
  setData(data.data);
} else {
  throw new Error(data.message || 'Request failed');
}
```

### Component Safety Patterns  
**Defensive programming** - components handle undefined data gracefully:
```typescript
// Pattern in ExperienceCard.tsx, StoryCard.tsx
const categoryName = category?.name || 'Other';
const locationText = city?.name || hostLocation || 'Location TBD';
```

### Mobile State Management
**Provider pattern** with API service injection:
```dart
// lib/providers/trip_provider.dart
class TripProvider with ChangeNotifier {
  final ApiService _apiService;
  // Always notify listeners after state changes
  notifyListeners();
}
```

## Production Deployment Context
**Target**: Alibaba Cloud Simple Application Server
**Strategy**: Multi-container Docker Compose with Nginx reverse proxy
**Environment**: Production uses docker-compose.prod.yml overlay with SSL termination

## Project-Specific Conventions
- **API versioning**: All endpoints prefixed with `/api/v1/`
- **TypeScript interfaces**: Shared types in `/web/src/types/` and individual hook files
- **Image paths**: Always start with `/images/` and route through backend ImageService
- **Database naming**: snake_case columns, camelCase in frontend after transformation
- **Error boundaries**: Loading states and error handling in all data-fetching components
- **Mobile navigation**: go_router with Provider-based authentication checks
