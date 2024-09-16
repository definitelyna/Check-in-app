const express = require("express");
const cors = require("cors");
const Attendee = require("./models/attendee.model");
const { connectDB } = require("./db/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
});

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}


app.post("/api/attendees", async (req, res) => {
  try {
    const attendee = await Attendee.create(req.body);
    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/attendees", async (req, res) => {
  try {
    const attendees = await Attendee.find({});
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/attendees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const attendees = await Attendee.findById(id);
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/attendees/:category/:categoryFilter", async (req, res) => {
  try {
    let { category, categoryFilter } = req.params;

    if (category == "id") {
      category = "_" + category;
    }

    titleCaseFilter = toTitleCase(categoryFilter);

    query = { [category]: titleCaseFilter };
    const attendee = await Attendee.find(query);
    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/attendees/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const attendee = await Attendee.findByIdAndUpdate(id, req.body);
    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/attendees/deleteall", async (req, res) => {
  try {
    const attendee = await Attendee.deleteMany({})
    res.status(200).json("Deleted all documents")
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
