module.exports = (sequelize, DataTypes) => {
  const UserBankAccount = sequelize.define('UserBankAccount', {
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
    bank_id: {
      type: DataTypes.INTEGER,
      field: 'bank_id',
      allowNull: false,
      references: {
        model: 'banks',
        key: 'id'
      }
    },
    account_number: {
      type: DataTypes.STRING(50),
      field: 'account_number',
      allowNull: false
    },
    account_holder_name: {
      type: DataTypes.STRING(100),
      field: 'account_holder_name',
      allowNull: false
    },
    branch_name: {
      type: DataTypes.STRING(100),
      field: 'branch_name',
      allowNull: true
    },
    branch_code: {
      type: DataTypes.STRING(20),
      field: 'branch_code',
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      field: 'is_primary',
      defaultValue: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      field: 'is_verified',
      defaultValue: false
    },
    verification_date: {
      type: DataTypes.DATE,
      field: 'verification_date',
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
    tableName: 'user_bank_accounts',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'bank_id', 'account_number']
      }
    ]
  });

  return UserBankAccount;
};
