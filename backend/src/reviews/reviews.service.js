const knex = require("../db/connection");
const tableName = "reviews";

//Helper functions
async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

//Service-Level Controller Functions
const list = async (movie_id) => {
  return knex(tableName)
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(setCritic)));
};

const read = async (reviewId) =>
  knex(tableName).where({ review_id: reviewId }).first();

const update = async (updatedReview) => {
  return knex(tableName)
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => read(updatedReview.review_id))
    .then(setCritic);
}

const destroy = async (review_id) => knex(tableName).where({ review_id }).del();

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};
