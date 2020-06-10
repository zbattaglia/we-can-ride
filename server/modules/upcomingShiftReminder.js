// module to send nightly email to all admin users listing any shifts that are open
// and scheduled to take place in the next three days
const nodemailer = require('nodemailer');
const moment = require('moment');

module.exports = upcomingReminderEmail = ( reminderInfo ) => {
    // console.log( `In upcoming reminder module`, reminderInfo );
    // extract required email pieces from reminderInfo
    let toAddress = [];
    let upcomingShifts = [];
    // loop over admin users to create email list
    for( user of reminderInfo.admins ) {
        toAddress.push( user.email );
    };
    // loop over shifts to format for html
    for( shift of reminderInfo.shifts ) {
        upcomingShifts.push(`<br />${shift.role} on ${moment(shift.date).format('MMMM Do, YYYY')} arrive at ${shift.time_to_arrive}`);
    }
    // console.log( `In reminder module. Sending ${upcomingShifts} to ${toAddress}.` )
    // compose body of email
    let message = `This is a reminder of upcoming shifts that need to be filled:<br />
                    ${upcomingShifts}<br/>
                    <br />
                    You can log into the Scheduling Application to manage these shifts.`

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
        subject: `Automated Reminder - Upcoming Shifts`,
        html: `${message}`
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
    
    return message;
}