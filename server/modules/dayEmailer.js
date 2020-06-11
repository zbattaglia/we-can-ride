// module to send an email from admin to a full days roster of volunteers

// require nodemailer for emails
const nodemailer = require('nodemailer');

module.exports = dayEmailer = ( EmailInfo ) => {
    // extract info from EmailInfo
    const toAddress = EmailInfo.emails;
    const message = EmailInfo.message;
    const date = EmailInfo.date;
    console.log( `Sending info to volunteers: ${toAddress} on ${date} with message: ${message} from module` );

    // compose body of email
    const body = `You got an update from We Can Ride for ${date}:<br />
                    <br />
                    <b>${message}</b><br/>
                    <br />
                    If you have any questions please contact We Can Ride.<br />
                    <br />
                    Email: volunteers@wecanride.org<br />
                    Phone: 952-934-0057`

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
        subject: `A Message From We Can Ride`,
        html: `${body}`
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
}; //end upcomingReminder module