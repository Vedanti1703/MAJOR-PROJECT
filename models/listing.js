const mongoose=require("mongoose");
//const reviews = require("./models/review.js");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/two-shallow-focus-photo-of-white-ceramic-mugs-y3TWYaUj8Ew",
        set:(v)=> v===" "? "https://unsplash.com/photos/two-shallow-focus-photo-of-white-ceramic-mugs-y3TWYaUj8Ew":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
type:Schema.Types.ObjectId,
ref:"Reviews",
    },
],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;