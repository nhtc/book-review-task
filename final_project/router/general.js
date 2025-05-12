const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(v => v.username === username)) {
    return res.status(400).json({message: "User already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
  //Write your code here
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const bookListPromise = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });
  return bookListPromise
    .then((books) => {
      return res.status(200).json({books: books});
    })
    .catch((error) => {
      return res.status(500).json({message: error});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code 
  const isbn = parseInt(req.params.isbn)
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.status(200).json({book: book});
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author?.trim()
  if (!author) return res.status(400).json({message: "Missing author"})

  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase())
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor)
    } else {
      reject("No books found by this author")
    }
  })
    .then((book) => {
      return res.status(200).json({book: book});
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title?.trim()
  if (!title) return res.status(400).json({message: "Missing title"})
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
    if (booksByTitle.length > 0) {
      resolve(booksByTitle)
    } else {
      reject("No books found with this title")
    }
  }
  )
    .then((book) => {
      return res.status(200).json({data: book});
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn)
  if (isbn > 0) {
    const selectedBook = books[isbn]
    if (selectedBook) {
      return res.status(200).json({reviews: selectedBook.reviews})
    } else {
      return res.status(404).json({message: "Book not found"})
    }
  } else {
    return res.status(400).json({message: "Invalid ISBN"});
  }
});

module.exports.general = public_users;
