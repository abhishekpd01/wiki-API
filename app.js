// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//set up connection to mongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true});

// create new schema
const articleSchema = {
    title: String,
    content: String
}

// create model
const Article = mongoose.model("Article", articleSchema);

// access the data in from collection
app.get("/articles", async (req, res) => {
    try {
        const foundArticles = await Article.find(); // No callbacks, just await the promise
        res.status(200).json(foundArticles); // Send the found articles as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" }); // Handle any errors
    }
});

app.post("/articles", async function(req, res) {
    const newArticle = Article({
        title: req.body.title,
        content: req.body.content
    });

    try {
        await newArticle.save(); // Save the article and await its completion
        res.send("Successfully added new article.");
    } catch (error) {
        res.status(500).send(error); // Handle any errors during the save process
    }
});

app.delete("/articles", async function (req, res) {
    try {
        await Article.deleteMany();
        res.send("Successfully deleted all articles.");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, ()=>{
    console.log("Server is up and running on port 3000.");
})