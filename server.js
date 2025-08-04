require("dotenv").config();
const express = require("express");
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadeImageRoutes = require('./routes/image-routes');

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware bec. we get data from req.body() in auth-controller
app.use(express.json());//Returns middleware that only parses json

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadeImageRoutes);

app.listen(PORT, () => {
  console.log(`Server is now listening to the port ${PORT}`);
});
