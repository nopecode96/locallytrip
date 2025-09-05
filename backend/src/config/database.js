const { Sequelize } = require('sequelize');

// Configuration for different environments
const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'locallytrip',
    username: process.env.DB_USER || 'locallytrip_user',
    password: process.env.DB_PASSWORD || 'locallytrip_password',
    dialect: 'postgres',
    dialectOptions: {
      options: '-c search_path=locallytrip_schema,public'
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
};

// Export config for Sequelize CLI
module.exports = config;

// Create and export sequelize instance
let sequelize;
if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL from DigitalOcean
  sequelize = new Sequelize(process.env.DATABASE_URL, config.production);
} else {
  // Development: Use individual config
  sequelize = new Sequelize(config.development);
}

module.exports = { sequelize };
