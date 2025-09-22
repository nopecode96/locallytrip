const { Role } = require('../models');

const roleController = {
  // Get all active roles
  getRoles: async (req, res) => {
    try {
      const roles = await Role.findAll({
        where: {
          is_active: true
        },
        attributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: roles
      });

    } catch (error) {
      console.error('Get roles error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch roles'
      });
    }
  }
};

module.exports = roleController;