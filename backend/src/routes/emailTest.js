const express = require('express');
const router = express.Router();
const mailerooApiService = require('../services/mailerooApiService');

// Test endpoint untuk mengirim email test menggunakan Maileroo API
router.post('/test-email-api', async (req, res) => {
  try {
    
    
    const testEmail = {
      to: req.body.email || 'nopecode96@gmail.com', // Default atau dari request
      subject: 'LocallyTrip API Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #8B5CF6;">🎉 Maileroo API Test Success!</h2>
          <p>This email was sent successfully using Maileroo API v2 from LocallyTrip backend.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Service: Maileroo API</li>
            <li>Endpoint: https://smtp.maileroo.com/api/v2/emails</li>
            <li>Authentication: X-Api-Key header</li>
            <li>Time: ${new Date().toISOString()}</li>
          </ul>
          <p style="color: #059669; font-weight: bold;">✅ Integration successful!</p>
        </div>
      `,
      text: 'Maileroo API test email from LocallyTrip - Integration successful!'
    };
    
    const result = await mailerooApiService.sendEmail(testEmail);
    
    if (result.success) {
      
      res.json({
        success: true,
        message: 'Test email sent successfully',
        referenceId: result.referenceId,
        to: testEmail.to
      });
    } else {
      
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
