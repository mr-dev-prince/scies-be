import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
  const { title, description, date, imageUrl } = req.body;

  if (!title || !description || !date || !imageUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      imageUrl,
    });

    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getElectionEvents = async (_, res) => {
  try {
    const events = await Event.find({ type: "election" });
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching election events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
