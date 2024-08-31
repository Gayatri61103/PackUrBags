const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//index route
router.get("/",listingController.index);

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route
router.get("/:id", listingController.showListing);


router.post("/",wrapAsync(listingController.createListing));  

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);

router.put("/:id",isLoggedIn,isOwner,listingController.updateListing);

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
);

module.exports = router;