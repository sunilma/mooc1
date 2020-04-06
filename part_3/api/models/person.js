require('dotenv').config();

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {console.log('Database connected')})
.catch(error => {console.log('error connecting to MongoDB:', error.message)});

// creating a person model
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
});

personSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Person', personSchema);