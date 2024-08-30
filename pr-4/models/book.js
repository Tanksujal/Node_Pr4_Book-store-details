const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a book
const bookSchema = new Schema({
  bookName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or path to the image
    required: false
  },
  pages: {
    type: Number,
    required: true
  }
});

// Create a model using the schema
module.exports = mongoose.model('Book', bookSchema);


