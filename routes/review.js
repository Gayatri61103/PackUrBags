const express = require("express");
const router = express.Router({mergeParams :true});

const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewOwner, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")

router.post("/", isLoggedIn,reviewController.createReview);

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, reviewController.destroyReview);

module.exports = router;