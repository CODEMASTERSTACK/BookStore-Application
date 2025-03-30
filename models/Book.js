const mongoose = require('mongoose');

// book schema - keeping it simple for now
const BookSchema = new mongoose.Schema({
    title: String,      // book title
    author: String,     // book author
    category: String,   // book category
    price: Number,      // book price
    rating: Number,     // book rating (1-5)
    publishedDate: Date,// when book was published
    createdAt: {        // when book was added
        type: Date,
        default: Date.now
    }
});

// TODO: add more fields like description, cover image etc
// TODO: add proper validation for rating and price
// TODO: add book cover image - not sure how to handle file uploads yet
// FIXED: removed required fields to make it work with basic validation

// old code that didn't work:
// const BookSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     price: { type: Number, required: true }
// });

// Create text index for search functionality
BookSchema.index({ title: 'text' });

module.exports = mongoose.model('Book', BookSchema);