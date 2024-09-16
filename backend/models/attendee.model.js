const mongoose = require("mongoose")

const AttendeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },

  phoneNumber: {
    type: String,
    required: [true, "Please enter phone number"],
  },

  email: {
    type: String,
    required: [true, "Please enter email"],
  },

  hasArrived: {
    type: Boolean,
    default: false,
    required: false
  },

  arrivalTime: {
    type: String,
    required: false,
  },
});

const Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
