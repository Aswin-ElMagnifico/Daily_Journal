
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const { initial } = require("lodash");
const dbUtilities = require(__dirname + "/database_utilities")

var homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
var aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
var contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//  routes
app.get("/", function(req, res) {
  initAppInstance();
  renderHomePage(res);
});


app.get("/contact", function (req, res) {
  renderContactPage(res);
});


app.get("/about", function (req, res) {
  renderAboutPage(res);
});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
   
  let newPost = {
    title : req.body.postTitle,
    body : req.body.postBody
  };

  if (req.body.passwd === "magnific0") {
    dbUtilities.addPost(newPost, res);
  } else {
    res.redirect("/");
  }
  
});


app.get("/posts/:postId", function (req, res) {
  renderPostPage(_.lowerCase(req.params.postId), res);
});




// Methods

function initAppInstance() {
  posts = [];
  homeStartingContent = "If you're reading this, probably the database is down..\nAnyways, this is the home page, the posts will come up here!";
  aboutContent = "If you're reading this, probably the database is down..\nAnyways, this is the about page, the dev should have told you about this site right?"
  contactContent = "If you're reading this, probably the database is down..\nAnyways, this is the contact us (me) page, I mean you can literally make a post and I'll look at it :D"
}

async function renderHomePage(res) {
  let introText = await dbUtilities.getIntroMessages('home');
  let posts = await dbUtilities.getJournals();
  if(introText!= null) {
    res.render("home", {homeMessage: introText.msg, listOfPosts:posts});
  } else {
    res.render("home", {homeMessage: homeStartingContent, listOfPosts:posts});
  }
  
}

async function renderPostPage(postId, res) {
  let flag = false;
  
  if (posts.length === 0) {
    let updatedPosts = await dbUtilities.getJournals();
    updatedPosts.forEach(updatedPost => {
      posts.push(updatedPost);
    });
  }

  posts.forEach(post => {
    if (_.lowerCase(post.title) === postId) {
      flag = true;
      res.render('post', {post:post});
    }
  });

  if (!flag) {
    res.render('post', {
      title: "Not Found",
      body: "the post you are looking does not exists unless someone is playing with you.."
    } );
  }
}

async function renderContactPage(res) {
  let introText = await dbUtilities.getIntroMessages("contact");
  if (introText != null) {
    res.render("contact", {contactParagraph: introText.msg});
  } else {
    res.render("contact", {contactParagraph: contactContent});
  }
}

async function renderAboutPage(res) {
  let introText = await dbUtilities.getIntroMessages('about');
  if (introText != null) {
    res.render("about", {aboutParagraph: introText.msg});
  } else {
    res.render("about", {aboutParagraph: aboutContent});
  }
}

initAppInstance();

app.listen(process.env.PORT);
