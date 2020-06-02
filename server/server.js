
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const volunteerRouter = require('./routes/volunteer.router');
const shiftRouter = require('./routes/shift.router');
const sessionRouter = require('./routes/session.router');
const messageRouter = require('./routes/message.router');
const disableRouter = require('./routes/disable.router');
const activateRouter = require('./routes/activate.router');
const lessonRouter = require('./routes/lesson.router');
const passwordRouter = require('./routes/password.router');
const rolesRouter = require('./routes/roles.router');



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/volunteer', volunteerRouter);
app.use('/shift', shiftRouter);
app.use('/session', sessionRouter);
app.use('/message', messageRouter);
app.use('/disable', disableRouter);
app.use('/activate', activateRouter);
app.use('/lesson', lessonRouter);
app.use('/resetPassword', passwordRouter);
app.use('/roles', rolesRouter);


// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
