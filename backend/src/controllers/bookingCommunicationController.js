const { Booking, User, UserCommunicationContact, CommunicationApp } = require('../models');

/**
 * Get host communication contacts for successful booking
 * Only accessible if user has successful booking with the host
 * GET /bookings/:bookingId/host-contacts
 */
const getHostContactsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find booking and verify it belongs to the user
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        traveler_id: userId,
        status: ['confirmed', 'completed'] // Only for successful bookings
      },
      include: [
        {
          model: User,
          as: 'Host', // Assuming host relationship exists
          attributes: ['id', 'name']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not accessible'
      });
    }

    // Get host communication contacts
    const contacts = await UserCommunicationContact.findAll({
      where: {
        userId: booking.host_id,
        isPublic: true
      },
      include: [{
        model: CommunicationApp,
        as: 'app',
        where: { isActive: true },
        attributes: ['id', 'name', 'displayName', 'iconUrl', 'urlPattern']
      }],
      order: [
        ['isPreferred', 'DESC'],
        [{ model: CommunicationApp, as: 'app' }, 'sortOrder', 'ASC']
      ]
    });

    // Format contacts with links
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      app: contact.app,
      contactValue: contact.contactValue,
      isPreferred: contact.isPreferred,
      contactLink: contact.app.urlPattern ? 
        contact.app.urlPattern
          .replace('{username}', contact.contactValue)
          .replace('{phone}', contact.contactValue)
          .replace('{lineid}', contact.contactValue)
          .replace('{zaloid}', contact.contactValue)
          .replace('{userid}', contact.contactValue)
        : null
    }));

    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: booking.status,
          hostName: booking.Host?.name
        },
        contacts: formattedContacts
      },
      message: 'Host communication contacts retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching host contacts for booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host contacts',
      error: error.message
    });
  }
};

/**
 * Get traveler communication contacts for host
 * Only accessible if traveler has successful booking with the host
 * GET /bookings/:bookingId/traveler-contacts
 */
const getTravelerContactsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const hostId = req.user?.id;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find booking and verify it belongs to the host
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        host_id: hostId, // Assuming host_id field exists
        status: ['confirmed', 'completed'] // Only for successful bookings
      },
      include: [
        {
          model: User,
          as: 'Traveler', // Assuming traveler relationship exists
          attributes: ['id', 'name']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not accessible'
      });
    }

    // Get traveler communication contacts
    const contacts = await UserCommunicationContact.findAll({
      where: {
        userId: booking.traveler_id,
        isPublic: true
      },
      include: [{
        model: CommunicationApp,
        as: 'app',
        where: { isActive: true },
        attributes: ['id', 'name', 'displayName', 'iconUrl', 'urlPattern']
      }],
      order: [
        ['isPreferred', 'DESC'],
        [{ model: CommunicationApp, as: 'app' }, 'sortOrder', 'ASC']
      ]
    });

    // Format contacts with links
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      app: contact.app,
      contactValue: contact.contactValue,
      isPreferred: contact.isPreferred,
      contactLink: contact.app.urlPattern ? 
        contact.app.urlPattern
          .replace('{username}', contact.contactValue)
          .replace('{phone}', contact.contactValue)
          .replace('{lineid}', contact.contactValue)
          .replace('{zaloid}', contact.contactValue)
          .replace('{userid}', contact.contactValue)
        : null
    }));

    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: booking.status,
          travelerName: booking.Traveler?.name
        },
        contacts: formattedContacts
      },
      message: 'Traveler communication contacts retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching traveler contacts for booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch traveler contacts',
      error: error.message
    });
  }
};

module.exports = {
  getHostContactsForBooking,
  getTravelerContactsForBooking
};
