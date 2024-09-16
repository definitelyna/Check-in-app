const mongoose = require("mongoose")

const AttendeeSchema = mongoose.Schema({
  _id: false,
  stt: {
    type: Number,
    required: [true, "Please enter stt"]
  },
  name: {
    type: String,
    required: false
  },

  address: {
    type: String,
    required: false
  },

  size: {
    type: String,
    required: false
  },

  phoneNumber: {
    type: String,
    required: false
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
