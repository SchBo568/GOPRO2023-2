const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
    },
});

// Function to send an email
export async function sendMail(to: string, subject: string, text: string) {
    try {
        // Send mail with defined transport object
        await transporter.sendMail({
            from: 'Good2Loan <good2loan@gmail.com>',
            to,
            subject,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                color: #333;
                            }
                            h1 {
                                color: blue;
                            }
                            p {
                                margin-bottom: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${subject}</h1>
                        <p>${text}</p>
                    </body>
                </html>
            `,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
