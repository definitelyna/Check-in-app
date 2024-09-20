const mongoose = require("mongoose");

const AttendeeSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: [true, "Please enter _id"],
  },
  name: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },

  size: {
    type: String,
    required: false,
  },

  phoneNumber: {
    type: String,
    required: false,
  },

  qrCode: {
    type: String,
    required: false,
    default: function () {
      return `https://raw.githubusercontent.com/definitelyna/check-in-qr-codes/refs/heads/master/checkinattendee${this._id}.png`;
    },
  },

  hasArrived: {
    type: Boolean,
    default: false,
    required: false,
  },

  arrivalTime: {
    type: String,
    required: false,
  },
});

const Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
