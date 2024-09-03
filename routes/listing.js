const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

//Index route

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

router.get("/",wrapAsync (async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
res.render("listings/show.ejs",{listing});
}));

//create new
router.get("/new",wrapAsync (async(req,res)=>{
    res.render("listings/new.ejs");
}));
    
router.post("/",wrapAsync(async(req,res)=>{
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
console.log(newListing);
    res.redirect("/listings");
})
);


//update
router.get("/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

router.put("/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid data");
            }
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success","Listing updated!");
   res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));




module.exports=router;