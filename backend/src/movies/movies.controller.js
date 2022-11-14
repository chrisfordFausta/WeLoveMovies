const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Route-Level Middleware
const movieExists = async (req, res, next) => {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({
    status: 404,
    message: "Movie cannot be found.",
  });
};

//Route-Level Controller Functions
const list = async (req, res) =>
  res.json({ data: await service.list(req.query.is_showing) });

const read = async (req, res) => res.json({ data: res.locals.movie });

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
};
