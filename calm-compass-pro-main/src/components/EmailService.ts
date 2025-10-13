// Email Service Simulation
// In a real implementation, you would integrate with services like:
// - SendGrid
// - AWS SES
// - Mailgun
// - Nodemailer with SMTP

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const sendVerificationEmail = async (email: string, clinicName: string, verificationCode: string): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const emailTemplate: EmailTemplate = {
      to: email,
      subject: `Verify Your Clinic Registration - ${clinicName}`,
      html: generateVerificationEmailHTML(clinicName, verificationCode),
      text: generateVerificationEmailText(clinicName, verificationCode)
    };

    // In a real implementation, you would send this email
    console.log("📧 Email would be sent:", {
      to: emailTemplate.to,
      subject: emailTemplate.subject,
      verificationCode: verificationCode
    });

    // Simulate successful email sending
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
};

const generateVerificationEmailHTML = (clinicName: string, verificationCode: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Clinic Registration</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .verification-code { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 MindCare Platform</h1>
          <p>Clinic Registration Verification</p>
        </div>
        
        <div class="content">
          <h2>Hello ${clinicName} Team!</h2>
          
          <p>Thank you for registering your clinic with MindCare. To complete your registration, please verify your email address using the code below:</p>
          
          <div class="verification-code">
            ${verificationCode}
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code expires in 10 minutes</li>
            <li>Enter this code in the verification form</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
          
          <p>Once verified, your clinic registration will be submitted for review. We'll notify you within 2-3 business days about the approval status.</p>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>
          The MindCare Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to verify your clinic registration on MindCare Platform.</p>
          <p>© 2024 MindCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateVerificationEmailText = (clinicName: string, verificationCode: string): string => {
  return `
    MindCare Platform - Clinic Registration Verification
    
    Hello ${clinicName} Team!
    
    Thank you for registering your clinic with MindCare. To complete your registration, please verify your email address using the code below:
    
    Verification Code: ${verificationCode}
    
    Important:
    - This code expires in 10 minutes
    - Enter this code in the verification form
    - If you didn't request this, please ignore this email
    
    Once verified, your clinic registration will be submitted for review. We'll notify you within 2-3 business days about the approval status.
    
    If you have any questions, please contact our support team.
    
    Best regards,
    The MindCare Team
    
    ---
    This email was sent to verify your clinic registration on MindCare Platform.
    © 2024 MindCare. All rights reserved.
  `;
};

// Additional email templates for different scenarios
export const sendApprovalEmail = async (email: string, clinicName: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("📧 Approval email would be sent to:", email);
    console.log("Subject: Your clinic registration has been approved!");
    
    return true;
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return false;
  }
};

export const sendRejectionEmail = async (email: string, clinicName: string, reason: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("📧 Rejection email would be sent to:", email);
    console.log("Subject: Clinic registration update");
    console.log("Reason:", reason);
    
    return true;
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return false;
  }
};
