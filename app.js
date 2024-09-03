const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js");
//const Review=require("./models/review");
const session=require("express-session");
const flash = require("connect-flash");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24* 60 *60* 1000,
        maxAge: 7 * 24* 60 *60*1000,
        httpOnly:true
    },
};



app.get("/",(req,res)=>{
    res.send("Hi im root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/testlisting",async (req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Goa",
        country:"India",
    });
await sampleListing.save();
console.log("saved");
res.send("successful");
});


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});


app.listen(3000,()=>{
    console.log("working");
});