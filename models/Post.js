// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // rasm fayl nomi (masalan: "post-123.jpg")
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
