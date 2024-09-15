const mongoose = require("mongoose")

const AttendeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },

  phoneNumber: {
    type: String,
    required: [true, "Please enter day"],
  },

  email: {
    type: String,
    required: [true, "Please enter start time"],
  },

  hasArrived: {
    type: Boolean,
    required: [true, "Please enter end time"],
  },

  arrivalTime: {
    type: String,
    required: false,
  },
});

const Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
