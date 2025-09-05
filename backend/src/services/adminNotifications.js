const emailService = require('./emailService');

class AdminNotifications {
  // New user registration
  static async newUserRegistration(user) {
    try {
      const subject = 'New User Registration';
      const content = `
        <p>A new user has registered on LocallyTrip:</p>
        <ul>
          <li><strong>Name:</strong> ${user.name || 'N/A'}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Role:</strong> ${user.role || 'traveller'}</li>
          <li><strong>City:</strong> ${user.cityId || 'Not specified'}</li>
          <li><strong>Registration Date:</strong> ${new Date(user.createdAt).toLocaleString()}</li>
        </ul>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        userId: user.id,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      
      return { success: false, error: error.message };
    }
  }

  // New booking created
  static async newBookingCreated(booking) {
    try {
      const subject = 'New Booking Created';
      const content = `
        <p>A new booking has been created on LocallyTrip:</p>
        <ul>
          <li><strong>Experience:</strong> ${booking.experience?.title || 'N/A'}</li>
          <li><strong>Host:</strong> ${booking.host?.name || 'N/A'} (${booking.host?.email || 'N/A'})</li>
          <li><strong>Traveler:</strong> ${booking.traveler?.name || 'N/A'} (${booking.traveler?.email || 'N/A'})</li>
          <li><strong>Amount:</strong> ${booking.currency || 'USD'} ${booking.totalAmount || '0'}</li>
          <li><strong>Date:</strong> ${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'TBD'}</li>
          <li><strong>Participants:</strong> ${booking.participants || 1}</li>
          <li><strong>Reference:</strong> ${booking.bookingReference || booking.id}</li>
        </ul>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        bookingId: booking.id,
        hostEmail: booking.host?.email,
        travelerEmail: booking.traveler?.email,
        amount: booking.totalAmount
      });
    } catch (error) {
      
      return { success: false, error: error.message };
    }
  }

  // Payment failed
  static async paymentFailed(booking, error) {
    try {
      const subject = 'Payment Failed Alert';
      const content = `
        <p style="color: #DC2626;">A payment has failed for a LocallyTrip booking:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Experience:</strong> ${booking.experience?.title || 'N/A'}</li>
          <li><strong>Amount:</strong> ${booking.currency || 'USD'} ${booking.totalAmount || '0'}</li>
          <li><strong>Traveler:</strong> ${booking.traveler?.email || 'N/A'}</li>
          <li><strong>Error:</strong> ${error}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p><strong>Action Required:</strong> Please investigate and contact the customer if necessary.</p>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        bookingId: booking.id,
        error: error,
        travelerEmail: booking.traveler?.email
      });
    } catch (err) {
      
      return { success: false, error: err.message };
    }
  }

  // System error
  static async systemError(error, context = {}) {
    try {
      const subject = 'System Error Alert';
      const content = `
        <p style="color: #DC2626;">A system error has occurred on LocallyTrip:</p>
        <ul>
          <li><strong>Error:</strong> ${error.message}</li>
          <li><strong>Type:</strong> ${error.name || 'Unknown'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Context:</strong> ${context.endpoint || context.function || 'Unknown'}</li>
        </ul>
        
        <details style="margin-top: 20px;">
          <summary><strong>Stack Trace:</strong></summary>
          <pre style="background: #F3F4F6; padding: 10px; border-radius: 4px; font-size: 12px; overflow-x: auto;">
${error.stack || 'No stack trace available'}
          </pre>
        </details>
        
        <p><strong>Action Required:</strong> Please investigate this error immediately.</p>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        error: error.message,
        stack: error.stack,
        context
      });
    } catch (err) {
      
      return { success: false, error: err.message };
    }
  }

  // New experience created
  static async newExperienceCreated(experience, host) {
    try {
      const subject = 'New Experience Created';
      const content = `
        <p>A new experience has been created on LocallyTrip:</p>
        <ul>
          <li><strong>Title:</strong> ${experience.title}</li>
          <li><strong>Host:</strong> ${host.name} (${host.email})</li>
          <li><strong>Price:</strong> ${experience.currency || 'USD'} ${experience.price || '0'}</li>
          <li><strong>Category:</strong> ${experience.category?.name || 'N/A'}</li>
          <li><strong>Location:</strong> ${experience.location || 'N/A'}</li>
          <li><strong>Status:</strong> ${experience.status || 'draft'}</li>
        </ul>
        
        ${experience.status === 'draft' ? 
          '<p><strong>Note:</strong> This experience is in draft status and needs approval before going live.</p>' : 
          ''}
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        experienceId: experience.id,
        hostEmail: host.email,
        status: experience.status
      });
    } catch (error) {
      
      return { success: false, error: error.message };
    }
  }

  // High booking volume alert
  static async highBookingVolumeAlert(bookingsCount, timeframe = '1 hour') {
    try {
      const subject = 'High Booking Volume Alert';
      const content = `
        <p style="color: #F59E0B;">High booking activity detected on LocallyTrip:</p>
        <ul>
          <li><strong>Bookings in last ${timeframe}:</strong> ${bookingsCount}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <p>This could indicate:</p>
        <ul>
          <li>Viral content or social media boost</li>
          <li>Successful marketing campaign</li>
          <li>Potential system load issues</li>
        </ul>
        
        <p><strong>Action:</strong> Monitor system performance and be ready to scale resources if needed.</p>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        bookingsCount,
        timeframe,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      
      return { success: false, error: error.message };
    }
  }

  // Database connection issues
  static async databaseConnectionAlert(error) {
    try {
      const subject = 'Database Connection Alert';
      const content = `
        <p style="color: #DC2626;">Database connection issue detected:</p>
        <ul>
          <li><strong>Error:</strong> ${error.message}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <p><strong>Immediate Action Required:</strong> Check database server status and connection.</p>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      
      return { success: false, error: err.message };
    }
  }

  // Email delivery failure
  static async emailDeliveryFailure(originalEmail, error) {
    try {
      const subject = 'Email Delivery Failure';
      const content = `
        <p style="color: #DC2626;">An email failed to be delivered:</p>
        <ul>
          <li><strong>Recipient:</strong> ${originalEmail.to}</li>
          <li><strong>Subject:</strong> ${originalEmail.subject}</li>
          <li><strong>Error:</strong> ${error}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <p><strong>Action:</strong> Check email service status and recipient email validity.</p>
      `;
      
      return await emailService.sendAdminNotification(subject, content, {
        failedEmail: originalEmail,
        error,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      
      return { success: false, error: err.message };
    }
  }
}

module.exports = AdminNotifications;
