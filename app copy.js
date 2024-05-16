const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'naman.intelcode@gmail.com', // Replace with your email
        pass: 'peav zved njcd ropg' // Replace with your email password
    }
});

// Email options
let mailOptions = {
    from: 'naman.intelcode@gmail.com', // Sender address
    to: 'sunil@intencode.com', // List of recipients
    subject: 'Node.js Email Test', // Subject line
    text: 'Hello from Node.js!', // Plain text body
    html: '<b>Hello from Node.js!</b>' // HTML body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Message Sent: ${info.response}`);
});