const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/sendmail', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const emailMessage = `
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Email Message</title>
            <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
            <style>
                .email-container {
                    margin-top: 30px;
                }
                .email-header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 15px;
                    border-radius: 5px 5px 0 0;
                }
                .email-body {
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-top: none;
                    border-radius: 0 0 5px 5px;
                }
            </style>
        </head>
        <body>
            <div class='container email-container'>
                <div class='email-header'>
                    <h2>New Message from ${name}</h2>
                </div>
                <div class='email-body'>
                    <div class='mb-3'>
                        <strong>Name:</strong> ${name}
                    </div>
                    <div class='mb-3'>
                        <strong>Email:</strong> ${email}
                    </div>
                    <div class='mb-3'>
                        <strong>Phone:</strong> ${phone}
                    </div>
                    <div class='card'>
                        <div class='card-body'>
                            <h5 class='card-title'>Message:</h5>
                            <p class='card-text'>${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const confirmationMessage = `
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Confirmation Email</title>
            <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
        </head>
        <body>
            <div class='container'>
                <div class='alert alert-success' role='alert'>
                    <h4 class='alert-heading'>Thank You!</h4>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                    <hr>
                    <p class='mb-0'>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // Send confirmation email to the user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting us!',
            html: confirmationMessage
        });

        // Send notification email to yourself
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'naman.intelcode@gmail.com',
            subject: `New Message from ${name}`,
            html: emailMessage
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        res.status(500).json({ success: false, error: 'Oops! Something went wrong. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
