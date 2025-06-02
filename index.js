require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const aboutRoutes = require('./routes/aboutRoutes');
const headRoutes = require('./routes/headRoutes');
const skillRoute = require('./routes/skillRoute');
const projectRoutes = require('./routes/projectRoutes');
const certificateRoute = require('./routes/certificateRoute');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use('/about', aboutRoutes);
app.use('/head', headRoutes);
app.use('/skills', skillRoute);
app.use('/projects', projectRoutes);
app.use('/certificates', certificateRoute);

app.listen(PORT, async () => {
  await connectDB().catch(console.dir);
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`,
  );
});
