
module.exports = (sequelize, DataTypes) => {
  const StoryComment = sequelize.define('StoryComment', {
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
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'story_comments',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_approved'
  }
}, {
  tableName: 'story_comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    {
      fields: ['story_id', 'parent_id']
    },
    {
      fields: ['user_id']
    }
  ]
});


  return StoryComment;
};
