const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registereduser = await User.register(newUser,password);
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if (err){
            return next(err);
        }
        req.flash("success","You are registered! Welcome");
        res.redirect("/listings");
    })
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome! You are logged in !");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings");
    })
}