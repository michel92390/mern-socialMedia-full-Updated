//jshint esversion:6
const mongoose = require('mongoose');

mongoose
.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@socialmedia.i85y1.mongodb.net/social-media-updated",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));