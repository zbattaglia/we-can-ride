// module to send email notification to admin when volunteer puts a shift up for grabs
const nodemailer = require('nodemailer');

module.exports = tradeShiftEmail = ( emailInfo) => {
    // get email parameters from emailInfo
    const adminList = [];
    const date = emailInfo.date;
    const startTime = emailInfo.startTime;
    const title = emailInfo.title;
    const volunteer = emailInfo.volunteer;

    const body = `This is an automated email from the We Can Ride volunteer application: <br />
                    ${volunteer} is looking to give up their ${title} shift on ${date} at ${startTime}.`;
    for( admin of emailInfo.toList ) {
        adminList.push( admin.email );
    }

    console.log( `Sending email to all admin users: ${adminList}, ${body}` );

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
        to: `${adminList}`,
        subject: `Shift being canceled`,
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

}; // end sendEmail