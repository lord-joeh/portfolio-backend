require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
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
  origin: "https://joseph-mensahportfolio.vercel.app",
  methods: ["GET", "POST", "DELETE"],
};

app.use(cors(corsOptions));

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use("/auth", auth);
app.use("/about", aboutRoutes);
app.use("/head", headRoutes);
app.use("/skills", skillRoute);
app.use("/projects", projectRoutes);
app.use("/certificates", certificateRoute);
app.use("/notifications", notificationRoute);

app.listen(PORT, async () => {
  await connectDB().catch(console.dir);
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
