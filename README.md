# We Can Ride 

The purpose of this application is to help coordinate volunteers by creating a scheduling management framework.  Below you will find instructions for getting the app set up, and included in the documentation.pdf file are instructions for using and navigating the app as both an admin and a volunteer.

### Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

* Create a new database in postgreSQL called `we-can-ride` and create the given tables using the database.sql file.  This allows you to store and retrieve data.
* Run `npm install` in the terminal to add the necessary dependencies.
* Create a `.env` file at the root of the project and paste this line into the file:
    ```
    SERVER_SESSION_SECRET=superDuperSecret
    ```
    While you're in your new `.env` file, take the time to replace `superDuperSecret` with some long random string like `25POUbVtx6RKVNWszd9ERB9Bb6` to keep your application secure. Here's a site that can help you: [https://passwordsgenerator.net/](https://passwordsgenerator.net/). If you don't do this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you will get a warning.
* Start postgres if not running already by using `brew services start postgresql`
* Run `npm run server`
* Run `npm run client`
* Navigate to `localhost:3000`
* Use the provided username/password for initial login, after which we recommend changing your password.


## Authors

* **Billy Blaze** - (https://github.com/w4bb4j4ck)
* **Erick Jensen** - (https://github.com/ErickDJensen)
* **Frieda Jacobson** - (https://github.com/kajakali)
* **Max Faust** - (https://github.com/MaxFaust)
* **Zach Battaglia** - (https://github.com/zbattaglia)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to our wonderful instructors at Prime Digital Academy, as well as our amazing cohortmates for their support and encouragement!
* Thanks to Material UI, Node.js, Moment, and all the other giants upon whose shoulders we stand.


