const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with optional sorting
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating]
 *         description: Field to sort by (price or rating)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server Error
 */
router.get('/', async (req, res) => {
    try {
        console.log('Getting all books');
        let books = await Book.find();

        // handle sorting
        if (req.query.sortBy === 'price') {
            console.log('Sorting by price:', req.query.order);
            books = books.sort((a, b) => {
                return req.query.order === 'desc' ? b.price - a.price : a.price - b.price;
            });
        } else if (req.query.sortBy === 'rating') {
            console.log('Sorting by rating:', req.query.order);
            books = books.sort((a, b) => {
                return req.query.order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
            });
        }

        console.log('Found', books.length, 'books');
        res.json(books);
    } catch (err) {
        console.log('Get books error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server Error
 */
router.get('/:id', async (req, res) => {
    try {
        console.log('Getting book with id:', req.params.id);
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found:', req.params.id);
            return res.status(404).json({ msg: 'Book not found' });
        }
        console.log('Found book:', book.title);
        res.json(book);
    } catch (err) {
        console.log('Get book error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server Error
 */
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating new book:', req.body.title);
        const newBook = new Book(req.body);
        const book = await newBook.save();
        console.log('Book created successfully:', book.title);
        res.json(book);
    } catch (err) {
        console.log('Create book error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server Error
 */
router.put('/:id', auth, async (req, res) => {
    try {
        console.log('Updating book:', req.params.id);
        let book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found for update:', req.params.id);
            return res.status(404).json({ msg: 'Book not found' });
        }

        // update fields
        Object.keys(req.body).forEach(key => {
            book[key] = req.body[key];
        });

        await book.save();
        console.log('Book updated successfully:', book.title);
        res.json(book);
    } catch (err) {
        console.log('Update book error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server Error
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Deleting book:', req.params.id);
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found for delete:', req.params.id);
            return res.status(404).json({ msg: 'Book not found' });
        }

        await book.remove();
        console.log('Book deleted successfully:', book.title);
        res.json({ msg: 'Book deleted' });
    } catch (err) {
        console.log('Delete book error:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         title:
 *           type: string
 *           required: true
 *         author:
 *           type: string
 *           required: true
 *         category:
 *           type: string
 *           required: true
 *         price:
 *           type: number
 *           required: true
 *         rating:
 *           type: number
 *           required: true
 *           minimum: 1
 *           maximum: 5
 *         publishedDate:
 *           type: string
 *           format: date
 *           required: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     BookInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           required: true
 *         author:
 *           type: string
 *           required: true
 *         category:
 *           type: string
 *           required: true
 *         price:
 *           type: number
 *           required: true
 *         rating:
 *           type: number
 *           required: true
 *           minimum: 1
 *           maximum: 5
 *         publishedDate:
 *           type: string
 *           format: date
 *           required: true
 */

module.exports = router;
