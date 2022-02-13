const homeStartingContent = "Lacus vel facilisis volutpat est velit";
var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://adi:beast123@cluster0.0nlyt.mongodb.net/travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
// const postSchema = {
//   TravellingFrom: String,
//   TravellingTo: String,
//   Reason:String
// };

// const Post = mongoose.model("Post", postSchema);

// app.get("/admin", function(req, res){

//   Post.find({}, function(err, posts){
//     res.render("admin", {
//       startingContent: homeStartingContent,
//       posts: posts
//       });
//   });
// });

// app.get("/profile", function(req, res){
//   res.render("profile");
// });

// app.post("/profile", function(req, res){
//   const post = new Post({
//     TravellingFrom: req.body.postFrom,
//     TravellingTo: req.body.postTo,
//     Reason: req.body.postReason
//   })});

// const postSchema = {
//   title: String,
//   content: String
// };

// const Post = mongoose.model("Post", postSchema);

// app.get("/", function(req, res){

//   Post.find({}, function(err, posts){
//     res.render("home", {
//       startingContent: homeStartingContent,
//       posts: posts
//       });
//   });
// });
// app.get("/compose", function(req, res){
//   res.render("compose");
// });
// app.post("/compose", function(req, res){
//   const post = new Post({
//     title: req.body.postTitle,
//     content: req.body.postBody
//   });

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
    TravellingFrom: post.From,
    TravellingTo: post.To,
    Reason: post.Reason
        // title: post.title,
        // content: post.content
      });
    });
  
  });
  




const PORT = process.env.PORT ||3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});
