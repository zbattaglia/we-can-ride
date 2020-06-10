// module to send weekly email to all user's with shifts in the next week
// called from server.js on node-cron schedule
// nodemailer required to send emails, moment required to format dates in messages
const nodemailer = require('nodemailer');
const moment = require('moment');

module.exports = weeklyReminderEmail = ( reminderInfo ) => {
    // extract required email pieces from reminderInfo
    // toAddress is address of user being emailed
    // recipient is first name of user being emailed
    // shifts is a blank array to hold all upcoming shifts
    const toAddress = reminderInfo.email;
    const recipient = reminderInfo.firstName;
    let upcomingShifts = [];
    // loop through upcomingShift to format for html message
    for( shift of reminderInfo.upcomingShift ) {
        upcomingShifts.push(`<br />${shift.role} on ${moment(shift.date).format('MMMM Do, YYYY')} arrive at ${shift.time_to_arrive}`);
    }
    // compose body of email
    let message = `Hi ${recipient},<br />
                    <br />You have some We Can Ride volunteer shifts coming up this week:<br />
                    ${upcomingShifts}<br/>
                    <br />
                    You can log into the Volunteer Application to manage these shifts. If you have any questions,
                    please reach out to We Can Ride directly.<br />
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
        subject: `Your We Can Ride Shifts This Week`,
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
}