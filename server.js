const mongoose = require('mongoose');
const dotenv = require('dotenv');

// uncaught exceptions
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught exception. Server shutting down.');
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true 
})
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection. Server shutting down.');
    server.close(() => {
        process.exit(1);
    });
});