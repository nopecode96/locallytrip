
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(220),
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      field: 'author_id',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    cityId: {
      type: DataTypes.INTEGER,
      field: 'city_id',
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    coverImage: {
      type: DataTypes.STRING(255),
      field: 'cover_image',
      allowNull: true
    },
    images: {
      type: DataTypes.JSON, // Array of image URLs
      allowNull: true
    },
  // SEO fields
  metaTitle: {
    type: DataTypes.STRING(60),
    field: 'meta_title',
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    field: 'meta_description',
    allowNull: true
  },
  keywords: {
    type: DataTypes.JSON, // Array of keywords
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON, // Array of tags for categorization
    allowNull: true
  },
  // Content settings
  readingTime: {
    type: DataTypes.INTEGER, // estimated reading time in minutes
    field: 'reading_time',
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(5),
    defaultValue: 'en'
  },
  // Status and metrics
  status: {
    type: DataTypes.ENUM('draft', 'published', 'scheduled', 'archived'),
    defaultValue: 'draft'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    field: 'is_featured',
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    field: 'view_count',
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    field: 'like_count',
    defaultValue: 0
  },
  commentCount: {
    type: DataTypes.INTEGER,
    field: 'comment_count',
    defaultValue: 0
  }
}, {
  tableName: 'stories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['author_id', 'status']
    },
    {
      fields: ['city_id', 'status']
    },
    {
      fields: ['is_featured', 'status']
    },
    {
      fields: ['view_count', 'like_count']
    }
  ]
});

  Story.associate = function(models) {
    // Story belongs to author (User)
    Story.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });

    // Story belongs to city
    Story.belongsTo(models.City, {
      foreignKey: 'cityId',
      as: 'City'
    });
  };

  return Story;
};
