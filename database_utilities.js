const mongoose = require('mongoose');

// provide ther database url here       
const DB_URL = process.env.DB_URL

const introSchema = {
    page: String,
    msg: String
}

const journalSchema = {
    title: String,
    body: String
}

// connection to database
mongoose.connect(DB_URL, { useNewUrlParser: true , useUnifiedTopology: true })
        .catch(error => console.log(error));


function getIntroMessages(page) {
    let query = IntroMessages.findOne({page:page});
    let doc =  query.exec();
    return doc;
}

function getJournals() {
    let query = Journals.find({});
    return query.exec();
}
function addPost(post, res) {
    const journal = new Journals({
        title: post.title,
        body: post.body
    });
    journal.save((err, doc) => {
        if (err) {
            console.log("error saving the following");
            console.log(doc);
        }
         res.redirect("/");
    });

}



// mongoose models

const IntroMessages = mongoose.model("DailyJournal_msg", introSchema, "DailyJournal_msgs");

const Journals = mongoose.model("DailyJournal_db", journalSchema, "DailyJournal_db");



// exports

exports.getIntroMessages = getIntroMessages;
exports.getJournals = getJournals;
exports.addPost = addPost;