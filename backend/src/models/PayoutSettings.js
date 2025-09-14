module.exports = (sequelize, DataTypes) => {
  const PayoutSettings = sequelize.define('PayoutSettings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    minimum_payout: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'minimum_payout',
      defaultValue: 500000.00,
      allowNull: false
    },
    payout_frequency: {
      type: DataTypes.ENUM('weekly', 'biweekly', 'monthly'),
      field: 'payout_frequency',
      defaultValue: 'weekly',
      allowNull: false
    },
    auto_payout: {
      type: DataTypes.BOOLEAN,
      field: 'auto_payout',
      defaultValue: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'IDR',
      allowNull: false
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'tax_rate',
      defaultValue: 0.00,
      allowNull: false
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
    tableName: 'payout_settings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PayoutSettings;
};
