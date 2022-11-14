
if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound")
const cors = require("cors")

app.use(express.json());
app.use(cors());

const router = express.Router()
router.get('/', cors(), (req, res) => {
    res.json({
        message: "Welcome you can access the data in the back end"
    })
})

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// Not-found handler
app.use(notFound);

// Error handler
app.use(errorHandler);


module.exports = app;