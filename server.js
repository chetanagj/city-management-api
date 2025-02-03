const express = require("express");
const connectDB = require("./config/db");
const cityRoutes = require("./routes/cityRoutes");
require("dotenv").config();
const cors = require("cors");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Make sure "/api" is correctly set up
app.use("/api", cityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
