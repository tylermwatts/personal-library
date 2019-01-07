/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser: true});

const bookSchema = mongoose.Schema({
  title: {type: String, required: true},
  comments: {type: [], required: false, default: []},
  commentcount: {type: Number, required: false, default: 0}
})

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      var query = req.body._id || {};
      Book.find(query,(err,books)=>{
        if (err) return res.json(err);
        res.json(books);
      })
    })
    
    .post(function (req, res){
      if (!req.body.title) return res.json({error: 'No title provided!'})
      var title = req.body.title;
      var newBook = new Book({title: title, comments: [], commentcount: 0},(err,data)=>{
        if (err) return res.json(err)
      })
      newBook.save((err,data)=>{
        if (err) return res.json(err)
        return res.json(data);
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById(bookid, (err,book)=>{
        if (err) return res.json(err)
        if (!book) return res.json({error: 'No book with the given _id exists.'})
        res.json({_id: bookid, title: book.title, comments: book.comments})
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
