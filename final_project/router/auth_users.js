const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  const user = users.find(v => v.username === username);
  if (!user) {
    return res.status(401).json({message: "User not found"});
  }
  if (user.password !== password) {
    return res.status(401).json({message: "Invalid password"});
  }
  const accessToken = jwt.sign({data: username}, "access", {expiresIn: 60 * 60});
  req.session.authorization = {
    accessToken,
    username
  };
  return res.status(200).json({message: "User logged in successfully", accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code 
  const auth = req.session.authorization;
  const {username} = auth;
  const {isbn} = req.params;
  const {review} = req.body;
  if (!isbn || !review) {
    return res.status(400).json({message: "ISBN and review are required"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  if (!books[isbn].reviews[username]) {
    books[isbn].reviews[username] = "";
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added successfully", data: {[isbn]: books[isbn]}});
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code 
  const auth = req.session.authorization;
  const {username} = auth;
  const {isbn} = req.params;
  if (!isbn) {
    return res.status(400).json({message: "ISBN is required"});
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
  }
  return res.status(200).json({message: "Review deleted successfully", data: {[isbn]: books[isbn]}});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
