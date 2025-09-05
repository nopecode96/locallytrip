
module.exports = (sequelize, DataTypes) => {
  const UserLanguage = sequelize.define('UserLanguage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'language_id',
    references: {
      model: 'languages',
      key: 'id'
    }
  },
  proficiency: {
    type: DataTypes.ENUM('basic', 'intermediate', 'advanced', 'native'),
    allowNull: false,
    defaultValue: 'intermediate'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'user_languages',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'language_id']
    }
  ]
});


  return UserLanguage;
};
