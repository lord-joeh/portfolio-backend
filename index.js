require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const auth = require("./routes/authRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const headRoutes = require("./routes/headRoutes");
const skillRoute = require("./routes/skillRoute");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoute = require("./routes/certificateRoute");
const notificationRoute = require("./routes/notificationRoute");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://joseph-mensahportfolio.vercel.app"
      : "http://localhost:5000",
  methods: ["GET", "POST", "DELETE", "PUT"],
};

app.use(cors(corsOptions));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/auth", auth);
app.use("/about", aboutRoutes);
app.use("/head", headRoutes);
app.use("/skills", skillRoute);
app.use("/projects", projectRoutes);
app.use("/certificates", certificateRoute);
app.use("/notifications", notificationRoute);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy and running",
    timestamp: new Date(),
  });
});

app.listen(PORT, async () => {
  await connectDB().catch(console.dir);
  await connectRedis();
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
