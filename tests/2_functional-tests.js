/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'First post test'})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'First post test');
            assert.isArray(res.body.comments);
            assert.equal(res.body.commentcount, 0);
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: null})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'No title provided!');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/5c337666af70453081656cd3') //this _id follows valid id format but does not exist in the DB
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'No book with the given _id exists.');
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/')
          .end((err,res)=>{
            var validId = res.body[0]._id;
            chai.request(server)
              .get('/api/books/' + validId)
              .end((err,res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body._id, validId);
                assert.isString(res.body.title);
                assert.isArray(res.body.comments);
                done();
              })
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .get('/api/books/')
          .end(function(err,res){  
            var idForComment = res.body[0]._id;
            chai.request(server)
              .post('/api/books/' + idForComment)
              .send({comment: "test comment"})
              .end(function(err,res){
                assert.equal(res.status, 200);
                assert.isString(res.body.title)
                assert.equal(res.body._id, idForComment);
                assert.isArray(res.body.comments);
                assert.equal(res.body.commentcount, res.body.comments.length);
                assert.equal(res.body.comments[res.body.comments.length - 1], "test comment");
                done();
              })
          })
      });
      
    });
    
    suite('DELETE book from collection by _id', function(){
      test('Test DELETE book with INVALID _id', function(done){
        chai.request(server)
          .delete('/api/books/5c337666af70453081656cd3') //this _id follows valid id format but does not exist in the DB
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "No book with the given _id exists.")
            done();
          })
      })
      test('Test DELETE book with VALID _id', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err,res){
            var idToDelete = res.body[0]._id;
            chai.request(server)
              .delete('/api/books/' + idToDelete)
              .end(function(err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.success, "delete successful");
                done();
              })
          })
      })
    });
    
    suite('DELETE entire collection', function(){
      test('Test DELETE to delete entire book collection', function(done){
        chai.request(server)
          .delete('/api/books')
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.success, 'complete delete successful');
            done();
          })
      })
    })

  });

});
