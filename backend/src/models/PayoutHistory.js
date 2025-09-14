module.exports = (sequelize, DataTypes) => {
  const PayoutHistory = sequelize.define('PayoutHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user_bank_account_id: {
      type: DataTypes.INTEGER,
      field: 'user_bank_account_id',
      allowNull: false,
      references: {
        model: 'user_bank_accounts',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'IDR',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    payout_reference: {
      type: DataTypes.STRING(100),
      field: 'payout_reference',
      allowNull: true,
      unique: true
    },
    processed_date: {
      type: DataTypes.DATE,
      field: 'processed_date',
      allowNull: true
    },
    completed_date: {
      type: DataTypes.DATE,
      field: 'completed_date',
      allowNull: true
    },
    failure_reason: {
      type: DataTypes.TEXT,
      field: 'failure_reason',
      allowNull: true
    },
    platform_fee: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'platform_fee',
      defaultValue: 0.00,
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'tax_amount',
      defaultValue: 0.00,
      allowNull: false
    },
    net_amount: {
      type: DataTypes.DECIMAL(12, 2),
      field: 'net_amount',
      allowNull: false
    },
    period_start: {
      type: DataTypes.DATE,
      field: 'period_start',
      allowNull: false
    },
    period_end: {
      type: DataTypes.DATE,
      field: 'period_end',
      allowNull: false
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
    tableName: 'payout_history',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PayoutHistory;
};
