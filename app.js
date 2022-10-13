//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "A paragraph of Starting content";
const aboutContent = "A paragraph of About content";
const contactContent = "A paragraph of Contact content";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/dailyJournalDB");
mongoose.connect("mongodb+srv://<admin>:<password>@<cluster>.9ihmvef.mongodb.net/dailyJournalDB");

const postSchema = new mongoose.Schema({ 
  title: String, 
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, postsFound) => {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: postsFound
      });
    }
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
})

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  })
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postContent
  })
  post.save((err => {
    if (!err) {
      res.redirect("/");
    }
  }));  
})

// Express routing parameters - Dynamic URL
app.get("/posts/:postID", (req, res) => {
  const requestedPostID = req.params.postID;

  Post.findOne({_id: requestedPostID}, (err, postFound) => {
    if (!err) {
      res.render("post", {                                                    // render post.ejs
        postTitle: postFound.title,
        postContent: postFound.content
      })
    }
  })
})

app.post("/delete", (req, res) => {
  const title = req.body.title;

  Post.findOneAndDelete({title: title}, (err) => {
    if (!err) {
      res.redirect("/");
    }
  });
})

app.listen(3000, function() {
  console.log("EJS Challenge Server started on port 3000");
});
