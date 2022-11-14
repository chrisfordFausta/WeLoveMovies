const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const list = async (req, res) => {
  res.json({ data: await service.list(req.params.movieId) });
};

module.exports = {
  list: asyncErrorBoundary(list),
};
