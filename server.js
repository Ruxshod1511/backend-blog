// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/admin", authRoutes);
app.use("/api", postRoutes);

// MongoDB ulanish
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.log("❌ Xato:", err));

// 👇 Bu yerda admin foydalanuvchini yaratamiz
const User = require("./models/User");

async function createAdmin() {
  const adminExists = await User.findOne({ username: "admin" });
  if (!adminExists) {
    const admin = new User({
      username: "ruxshod",
      password: "ruxshod2727,,", // parol avtomatik xeshlanadi
    });
    await admin.save();
    console.log("✅ Admin foydalanuvchi yaratildi: admin / admin123");
  }
}
createAdmin(); // Funksiyani chaqiramiz

// Server ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ishlayapti: http://localhost:${PORT}`);
});
