# Book Management API

A simple REST API for managing books with user authentication.

## Features

- User registration and login with JWT authentication
- CRUD operations for books
- Sorting books by price and rating
- Basic error handling and validation

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB:
Make sure MongoDB is running on your local machine at `mongodb://localhost:27017`

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/me` - Get current user

### Books
- GET `/api/books` - Get all books (with optional sorting)
- GET `/api/books/:id` - Get a single book
- POST `/api/books` - Create a new book (requires auth)
- PUT `/api/books/:id` - Update a book (requires auth)
- DELETE `/api/books/:id` - Delete a book (requires auth)

## Sorting Books

You can sort books by price or rating using query parameters:
- `GET /api/books?sortBy=price&order=asc` - Sort by price ascending
- `GET /api/books?sortBy=rating&order=desc` - Sort by rating descending

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## What I Built

- User login and registration
- Add, update, delete books
- View all books
- Sort books by price or rating
- API documentation using Swagger

## How to Run

### Method 1: Local Setup

1. First, make sure you have these installed:
   - Node.js
   - MongoDB
   - npm

2. Clone my code:
```bash
git clone <repository-url>
cd <project-directory>
```

3. Install the packages:
```bash
npm install
```

4. Create a file named `.env` and add these lines:
```env
MONGODB_URI=mongodb://localhost:27017/bookdb
JWT_SECRET=mysecretkey123
PORT=5000
```

5. Start MongoDB:
```bash
# On Windows
net start MongoDB

# On Linux/Mac
sudo service mongod start
```

6. Run the server:
```bash
npm run dev
```

### Method 2: Using Docker

If you have Docker installed, you can run it like this:
```bash
docker-compose up --build
```

## How to Use the API

### User Registration and Login

1. Register a new user:
```bash
curl -X POST http://localhost:5000/api/users/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```

2. Login:
```bash
curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```

### Book Operations

1. Get all books:
```bash
curl -X GET http://localhost:5000/api/books
```

2. Sort books by price:
```bash
curl -X GET "http://localhost:5000/api/books?sortBy=price&order=asc"
```

3. Add a new book:
```bash
curl -X POST http://localhost:5000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "category": "Fiction",
  "price": 29.99,
  "rating": 4.5,
  "publishedDate": "1997-06-26"
}'
```

4. Update a book:
```bash
curl -X PUT http://localhost:5000/api/books/BOOK_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "price": 24.99
}'
```

5. Delete a book:
```bash
curl -X DELETE http://localhost:5000/api/books/BOOK_ID \
-H "Authorization: Bearer YOUR_TOKEN"
```

## Important Notes

1. You need to be logged in to add/edit/delete books
2. The token you get after login needs to be added in the Authorization header
3. Book ratings should be between 1 and 5
4. Prices should be positive numbers

## What I Used

- Node.js and Express for the server
- MongoDB to store data
- JWT for user login
- Swagger for API docs
- Docker (optional)

## API Documentation

You can see all the API details at:
```
http://localhost:5000/api-docs
```

## Book Data Structure

```javascript
{
  title: String,        // Book title
  author: String,       // Author name
  category: String,     // Book category (optional)
  price: Number,        // Book price
  rating: Number,       // Rating from 1-5
  publishedDate: Date,  // When the book was published
  createdAt: Date       // When I added it to the database
}
```

## Things I Could Add Later

- Search books by title or author
- Add book reviews
- Add book cover images
- Add user roles (admin/user)
- Add pagination for book list
- Add more sorting options

## Known Issues

- No password reset functionality
- No email verification
- No rate limiting
- No caching

## Contact

If you find any bugs or have suggestions, please let me know! 