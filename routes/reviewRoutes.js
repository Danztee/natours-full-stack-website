const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
