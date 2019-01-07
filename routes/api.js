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
        console.log(books)
        res.json(books);
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      Book.findOne({title: title}, (err,book)=>{
        if (err) return res.json(err)
        if (book) return res.json({error: "This title already exists!"})
      })
        var newBook = new Book({title: title, comments: [], commentcount: 0},(err,data)=>{
          if (err) return res.json(err)
          newBook.save((err,data)=>{
          if (err) return res.json(err)
            res.json({title: data.title, _id: data._id});
          })
        })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
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
