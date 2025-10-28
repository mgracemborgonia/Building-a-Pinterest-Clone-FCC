const mongoose = require("mongoose");
const { Schema } = mongoose;
const ImageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});
const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
