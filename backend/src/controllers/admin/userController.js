const { User, Role, City, HostCategory, Experience, Booking } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const adminUserController = {
  // Get all users with pagination and filters
  getUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const role = req.query.role || '';
      const status = req.query.status || '';

      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      if (role) {
        whereConditions.role = role;
      }
      
      if (status === 'active') {
        whereConditions.is_active = true;
      } else if (status === 'inactive') {
        whereConditions.is_active = false;
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          },
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'slug']
          }
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          users: rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  },

  // Get user by ID with detailed information
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          },
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: HostCategory,
            as: 'hostCategories',
            through: { attributes: [] },
            attributes: ['id', 'name', 'slug']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get user statistics if they're a host
      let userStats = null;
      if (user.role === 'host') {
        const [experienceCount, bookingCount, totalRevenue] = await Promise.all([
          Experience.count({ where: { host_id: user.id } }),
          Booking.count({ 
            include: [{
              model: Experience,
              as: 'experience',
              where: { host_id: user.id }
            }]
          }),
          Booking.sum('total_amount', {
            where: { status: 'confirmed' },
            include: [{
              model: Experience,
              as: 'experience',
              where: { host_id: user.id }
            }]
          })
        ]);

        userStats = {
          experienceCount,
          bookingCount,
          totalRevenue: totalRevenue || 0
        };
      }

      res.json({
        success: true,
        data: {
          user,
          stats: userStats
        }
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const { 
        name, email, password, role, phone, city_id, 
        is_verified = false, is_active = true 
      } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }

      // Get role_id from role name
      const roleRecord = await Role.findOne({ where: { name: role } });
      if (!roleRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        role_id: roleRecord.id,
        phone,
        city_id,
        is_verified,
        is_active
      });

      // Return user without password
      const userResponse = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          },
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'slug']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user: userResponse }
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, phone, city_id, is_verified, is_active } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // If email is being changed, check for duplicates
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ 
          where: { 
            email,
            id: { [Op.ne]: id }
          }
        });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      // If role is being changed, get role_id
      let role_id = user.role_id;
      if (role && role !== user.role) {
        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) {
          return res.status(400).json({
            success: false,
            error: 'Invalid role'
          });
        }
        role_id = roleRecord.id;
      }

      // Update user
      await user.update({
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
        role_id,
        phone: phone !== undefined ? phone : user.phone,
        city_id: city_id !== undefined ? city_id : user.city_id,
        is_verified: is_verified !== undefined ? is_verified : user.is_verified,
        is_active: is_active !== undefined ? is_active : user.is_active
      });

      // Return updated user
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          },
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'slug']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  },

  // Delete user (soft delete by setting is_active to false)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Prevent deleting super admin
      if (user.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          error: 'Cannot delete super admin user'
        });
      }

      // Soft delete by setting is_active to false
      await user.update({ is_active: false });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  },

  // Reset user password
  resetPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);
      await user.update({ password: hashedPassword });

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
      });
    }
  }
};

module.exports = adminUserController;
