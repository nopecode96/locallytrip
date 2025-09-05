
module.exports = (sequelize, DataTypes) => {
  const StoryLike = sequelize.define('StoryLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'story_id',
    references: {
      model: 'stories',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'story_likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['story_id', 'user_id']
    }
  ]
});


  return StoryLike;
};
