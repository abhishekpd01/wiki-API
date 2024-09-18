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

//////////////////////////// Requests Targeting All Articles ////////////////////////////

// chained route handlers
app.route("/articles")
    .get(async function (req, res) {
        try {
            const foundArticles = await Article.find(); // No callbacks, just await the promise
            res.status(200).json(foundArticles); // Send the found articles as a JSON response
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" }); // Handle any errors
        }
    })

    .post(async function(req, res) {
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
    })

    .delete(async function (req, res) {
        try {
            await Article.deleteMany();
            res.send("Successfully deleted all articles.");
        } catch (error) {
            res.status(500).send(error);
        }
    }
);

//////////////////////////// Requests Targeting A Specific Article ////////////////////////////

app.route("/articles/:articleTitle")
    .get(async function (req, res) {
        try {
            const foundArticle = await Article.findOne({title: req.params.articleTitle});
            res.status(200).send(foundArticle);
        } catch (error) {
            res.send("No articles matching that title was found.");
        }
    })

    .put(async function(req, res) {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                {overwrite: true}
            )
            res.status(200).send("Successfully updated article.");
        } catch (error) {
            res.status(500).send(error);
        }
    })

    .patch(async function (req, res) {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {$set: req.body}
            )
            res.status(200).send("Article updated Successfully.");
        } catch (error) {
            res.status(500).send(error);
        }
    })

    .delete(async function(req, res) {
        try {
            await Article.deleteOne(
                {title: req.params.articleTitle}
            )
            res.status(200).send("Successfully deleted the corresponding article.");
        } catch (error) {
            res.status(500).send(error);
        }
    });

app.listen(3000, ()=>{
    console.log("Server is up and running on port 3000.");
});