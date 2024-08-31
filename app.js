if (process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const wrapAsync = require("./utils/wrapasync.js");
// const Review = require("./models/review.js");

const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("connected to db");
    }).catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tlsInsecure: true});
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store  = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN SESSION STORE");
});

const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


//use sessions
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
 
//home route
app.get("/packurbags",async(req,res)=>{
    res.render("listings/home.ejs");
});

//listing routes
app.use("/listings",listingrouter);

//reviews routes
app.use("/listings/:id/reviews",reviewrouter);

//user routes
app.use("/",userrouter);

app.use((err,req,res,next)=>{
    res.send("something went wrong !");
});

app.listen("8080",()=>{
    console.log("listening");
});
// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     registereduser = await User.register(fakeuser,"helloworld");
//     res.send(registereduser);
// });