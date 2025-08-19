// routes/posts.js
const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const auth = require("../middleware/auth"); // Faqat admin
const router = express.Router();

// Rasm saqlash sozlamasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `post-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Barcha postlarni olish
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Postni ID orqali olish
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post topilmadi" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yangi post qo'shish (admin)
router.post("/admin/posts", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({ title, content, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Postni o'zgartirish
router.put(
  "/admin/posts/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post topilmadi" });

      post.title = title || post.title;
      post.content = content || post.content;

      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }

      await post.save();
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Postni o'chirish
router.delete("/admin/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post topilmadi" });
    res.json({ message: "Post o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
