const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const alllist = await Listing.find({});
    res.render("listings/index.ejs",{alllist});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate :{
                path: "author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exist !");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
    let {title,description,image,price,location,country} = req.body;
    let newlist = new Listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,
    });
    newlist.owner = req.user._id;
    newlist.save();
    req.flash("success","  New listing created !");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let { title:newtitle, description:newdescription, image:newimage, price:newprice, location:newlocation, country:newcountry } = req.body;
    await Listing.findByIdAndUpdate(id,{ title:newtitle, description:newdescription, image:newimage, price:newprice, location:newlocation, country:newcountry });
    req.flash("success"," Listing updated !");
    res.redirect("/listings");
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params; 
    let dellist = await Listing.findByIdAndDelete(id);
    console.log(dellist);
    req.flash("success"," Listing deleted !");
    res.redirect("/listings");
    }