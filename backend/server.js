const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Complaint = require("./models/Complaint");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/cityfix")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("CityFix Backend Running");
});
app.post("/addComplaint", async (req, res) => {

  try {

    const complaint = new Complaint(req.body);

    await complaint.save();

    res.status(201).json({
      message: "Complaint Saved",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});
app.get("/getComplaints", async (req, res) => {

  try {

    const complaints = await Complaint.find();

    res.json(complaints);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});