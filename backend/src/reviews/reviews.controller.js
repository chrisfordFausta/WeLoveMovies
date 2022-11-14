const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Route-Level Middleware
const hasMovieIdInPath = (req, res, next) => {
  if (req.params.movieId) {
    return next();
  }
  methodNotAllowed(req, res, next);
};

const noMovieIdInPath = (req, res, next) => {
  if (req.params.movieId) {
    return methodNotAllowed(req, res, next);
  }
  next();
};

const reviewExists = async (req, res, next) => {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({
    status: 404,
    message: "Review cannot be found.",
  });
};

// Route-Level Controller Functions
const list = async (req, res) =>
  res.json({ data: await service.list(req.params.movieId) });

const update = async (req, res) => {
  const { review } = res.locals;
  const updatedReview = {
    ...review,
    ...req.body.data,
    review_id: review.review_id,
  };
  res.json({ data: await service.update(updatedReview) });
};

const destroy = async (req, res) => {
  await service.delete(res.locals.review.review_id);
  res.sendStatus(204);
};

module.exports = {
  delete: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
