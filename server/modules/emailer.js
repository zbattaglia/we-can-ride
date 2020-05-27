// module to send emails using nodemailer
const nodemailer = require('nodemailer');

module.exports = sendEmail = ( emailInfo) => {
    // get email parameters from emailInfo
    const toAddress = emailInfo.email;
    const recipient = emailInfo.first_name;
    const message = emailInfo.message;
    console.log( `Sending email to user ${recipient} at email address ${toAddress} with message ${message}` );


    // transporter designates the email service for the We Can Ride account
    // username and password stored in .env file for security
    let transporter = nodemailer.createTransport({
        // service: "Gmail" //instead of host?
        host: `smtp.gmail.com`,
        auth: {
            user: `${process.env.USERNAME}`,
            pass: `${process.env.PASSWORD}`
        }
    });

    // mailOptions specifies the recipient and body of the email
    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${toAddress}`,
        subject: `You got a message`,
        html: `<p>Hey ${recipient}! You got a message in We Can Ride!</p> <br /><p>${message}</p>`
    };

    // .sendMail uses the transporter and specified mail options to attempt to send an email.
    // logs success or error
    transporter.sendMail( mailOptions, (error, info ) => {
        if(error) {
            console.log( `Error sending email`, error );
        }
        else {
            console.log( 'Success!', info );
        }
    })

}; // end sendEmail