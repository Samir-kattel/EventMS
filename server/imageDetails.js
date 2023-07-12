const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
  {
   image:{
    type: String,
    default: ""
   }
  },
);

mongoose.model("ImageDetails", ImageDetailsScehma);
