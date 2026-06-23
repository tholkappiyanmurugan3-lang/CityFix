const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

  title: String,

  description: String,

  category: String,

  status: {
    type: String,
    default: "Pending",
  },

});

module.exports = mongoose.model("Complaint", complaintSchema);