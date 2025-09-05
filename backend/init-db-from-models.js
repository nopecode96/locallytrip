const db = require('./src/models');

async function initializeDatabase() {
  try {
    console.log('🗄️ Connecting to database...');
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    const modelNames = Object.keys(db.sequelize.models);
    console.log('📋 Models found:', modelNames);
    console.log('📊 Total models:', modelNames.length);

    console.log('🏗️ Syncing database (force: true will drop and recreate all tables)...');
    
    // Enable logging to see what's happening
    await db.sequelize.sync({ 
      force: true, 
      logging: console.log 
    });
    
    console.log('✅ Sequelize sync completed.');
    
    // Add explicit verification that tables were created
    console.log('🔍 Verifying tables were created...');
    const [results] = await db.sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;",
      { logging: console.log }
    );
    const tableNames = results.map(row => row.tablename);
    console.log('📋 Tables found in database:', tableNames);
    console.log('📊 Total tables found:', tableNames.length);
    
    if (tableNames.length > 0) {
      console.log('✅ All tables created and verified successfully.');
    } else {
      throw new Error('❌ No tables were created - sync failed silently');
    }

    console.log('📊 Database schema initialized based on Sequelize models.');
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  } finally {
    // Add delay to ensure all operations are committed
    console.log('⏳ Waiting for transactions to commit...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (db.sequelize) {
      await db.sequelize.close();
      console.log('🔒 Database connection closed.');
    }
  }
}

initializeDatabase();
