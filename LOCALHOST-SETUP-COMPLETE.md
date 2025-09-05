# LocallyTrip Environment Configuration

## Current Status: Localhost Development with Production Database Auth

### 📋 Configuration Summary

- **Environment**: Development (localhost)
- **Database Auth**: Production credentials (for easy sync to server)
- **Date Applied**: September 3, 2025

### 🌐 Service URLs

- **Web Frontend**: http://localhost:3000 
- **Admin Dashboard**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### 🗄️ Database Configuration

- **Database Name**: `locallytrip_prod`
- **Database User**: `locallytrip_prod_user` 
- **Host**: `postgres` (container internal) / `localhost` (external)
- **Port**: `5432`

### ✅ What Was Done

1. **Environment Variables Updated**:
   - Changed from production URLs to localhost
   - Maintained production database authentication
   - Updated email configuration for development
   - Set NODE_ENV to development

2. **Database Setup**:
   - Created fresh database with production credentials
   - Ran Sequelize sync to create all tables
   - Seeded data with sample records:
     - Users: 30 (hosts + travellers)
     - Experiences: 15 
     - Bookings: 15
     - Stories: 18
     - Reviews: 20
     - FAQs: 45

3. **Container Status**:
   - All services running and healthy
   - PostgreSQL: ✅ Healthy
   - Backend API: ✅ Healthy  
   - Web Frontend: ✅ Running
   - Admin Dashboard: ✅ Running

### 🔄 Sync with Production Server

To sync data to production server:

```bash
# Backup local database
docker exec locallytrip-postgres pg_dump -U locallytrip_prod_user locallytrip_prod > localtrip_backup.sql

# Transfer and restore to production (when needed)
scp localtrip_backup.sql user@server:/tmp/
ssh user@server "psql -U locallytrip_prod_user -d locallytrip_prod < /tmp/localtrip_backup.sql"
```

### 📝 Key Configuration Files

- **Environment**: `.env` (localhost with production DB auth)
- **Docker Compose**: `docker-compose.yml` (standard development)
- **Database Seeding**: `backend/db/seed/*.sql`

### 🚀 Next Steps

1. Test all frontend functionality at http://localhost:3000
2. Verify admin dashboard at http://localhost:3002  
3. Validate API endpoints at http://localhost:3001
4. Develop new features with existing data
5. Sync changes to production when ready

---

**Note**: This configuration allows easy development while maintaining compatibility with production database structure and authentication.
