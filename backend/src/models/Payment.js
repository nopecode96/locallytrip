
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    field: 'booking_id',
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'id'
    }
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'IDR'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    field: 'payment_method',
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  },
  payment_reference: {
    type: DataTypes.STRING(255),
    field: 'payment_reference',
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATE,
    field: 'payment_date',
    allowNull: true
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
  tableName: 'payments',
  timestamps: true,
  underscored: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

  return Payment;
};