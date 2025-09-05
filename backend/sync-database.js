const { sequelize } = require('./src/config/database');
const db = require('./src/models');

async function syncDatabase() {
  try {
    console.log('🔄 Starting database sync...');
    
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if models are loaded
    console.log('📚 Loaded models:', Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
    
    // Sync all models (force: true will recreate tables)
    console.log('🔨 Syncing database schema...');
    
    // Sync each model individually to see which ones work
    const modelNames = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
    for (const modelName of modelNames) {
      try {
        console.log(`   Syncing ${modelName}...`);
        await db[modelName].sync({ force: true });
      } catch (error) {
        console.error(`   ❌ Failed to sync ${modelName}:`, error.message);
      }
    }
    
    console.log('✅ Database schema synced successfully');
    
    console.log('📋 Created tables:');
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type LIKE '%TABLE' AND table_name != 'spatial_ref_sys';"
    );
    if (results && results.length > 0) {
      results.forEach(row => console.log(`   - ${row.table_name}`));
    } else {
      console.log('   No tables found');
    }
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

syncDatabase();
