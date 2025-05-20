const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text'); // Destructure for version 8.x+

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Suyash Nagar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Example production configuration for a service like SendGrid
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    // Development transport
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      // 1. Render HTML using Pug
      const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      // 2. Define email options
      const mailOptions = {
        // from: this.from,
        from: 'suyashnagar81@gmail.com',
        to: this.to,
        subject,
        html,
        text: htmlToText(html), // Convert HTML to plain text
      };

      // 3. Create transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('There was a problem sending the email.');
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token will be valid only for 10 minutes'
    );
  }
};
