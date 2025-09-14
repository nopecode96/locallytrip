const express = require('express');
const router = express.Router();
const mailersendService = require('../services/mailersendService');

// Test endpoint untuk mengirim email test menggunakan MailerSend API
router.post('/test-email-api', async (req, res) => {
  try {
    
    
    const testEmail = {
      to: req.body.email || 'nopecode96@gmail.com', // Default atau dari request
      subject: 'LocallyTrip API Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #8B5CF6;">🎉 MailerSend API Test Success!</h2>
          <p>This email was sent successfully using MailerSend API from LocallyTrip backend.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Service: MailerSend API</li>
            <li>SDK: @mailersend/nodejs</li>
            <li>Authentication: API Key</li>
            <li>Time: ${new Date().toISOString()}</li>
          </ul>
          <p style="color: #059669; font-weight: bold;">✅ Integration successful!</p>
        </div>
      `,
      text: 'MailerSend API test email from LocallyTrip - Integration successful!'
    };
    
    const result = await mailersendService.sendEmail(testEmail);
    
    if (result.success) {
      
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
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
