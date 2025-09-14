const express = require('express');
const { User, UserCommunicationContact, CommunicationApp, Booking, Payment } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Get host communication contacts after successful booking
 * GET /api/bookings/:bookingId/host-contacts
 * Only available for confirmed bookings with successful payment
 */
router.get('/:bookingId/host-contacts', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Verify booking belongs to user and has successful payment
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        traveler_id: userId,
        status: ['confirmed', 'completed'] // Only confirmed/completed bookings
      },
      include: [
        {
          model: Payment,
          as: 'payment',
          where: {
            status: 'completed' // Only successful payments
          },
          required: true
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name'],
          where: {
            role: 'host'
          }
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or payment not completed'
      });
    }

    // Get host communication contacts
    const contacts = await UserCommunicationContact.findAll({
      where: {
        userId: booking.host.id,
        isPublic: true // Only public contacts
      },
      include: [{
        model: CommunicationApp,
        as: 'app',
        where: { isActive: true }
      }],
      order: [
        ['isPreferred', 'DESC'],
        [{ model: CommunicationApp, as: 'app' }, 'sortOrder', 'ASC']
      ]
    });

    // Format with generated links
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      app: contact.app,
      contactValue: contact.contactValue,
      isPreferred: contact.isPreferred,
      contactLink: generateContactLink(contact.app, contact.contactValue)
    }));

    res.json({
      success: true,
      data: {
        hostName: booking.host.name,
        hostId: booking.host.id,
        bookingId: booking.id,
        contacts: formattedContacts
      },
      message: 'Host communication contacts retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching host contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host contacts',
      error: error.message
    });
  }
});

/**
 * Helper function to generate contact links
 */
function generateContactLink(app, contactValue) {
  if (!app.urlPattern) {
    return null;
  }

  let link = app.urlPattern;
  
  // Replace common placeholders
  link = link.replace('{username}', contactValue);
  link = link.replace('{phone}', contactValue);
  link = link.replace('{lineid}', contactValue);
  link = link.replace('{zaloid}', contactValue);
  link = link.replace('{userid}', contactValue);
  
  return link;
}

module.exports = router;
