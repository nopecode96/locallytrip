module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bank_code: {
      type: DataTypes.STRING(10),
      field: 'bank_code',
      allowNull: false,
      unique: true
    },
    bank_name: {
      type: DataTypes.STRING(100),
      field: 'bank_name',
      allowNull: false
    },
    bank_name_short: {
      type: DataTypes.STRING(50),
      field: 'bank_name_short',
      allowNull: true
    },
    swift_code: {
      type: DataTypes.STRING(11),
      field: 'swift_code',
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(2),
      field: 'country_code',
      defaultValue: 'ID'
    },
    logo_url: {
      type: DataTypes.STRING(255),
      field: 'logo_url',
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'banks',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Bank;
};
