const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Case = require('../../models/caseModel');

dotenv.config({ path: './config.env' });

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

// Read file
const cases = JSON.parse(fs.readFileSync(`${__dirname}/cases.json`, 'utf-8'));

// Import data to database
const importData = async () => {
    try {
        await Case.create(cases);
        console.log('Successful export dev data to database');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// Delete all data from database
const deleteData = async () => {
    try {
        await Case.deleteMany();
        console.log('Successful deleted all dev data from database');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}