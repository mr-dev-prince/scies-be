import Contact from "../models/contact.model.js";
import sendEmail from "../utils/sendEmail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message, category } = req.body;

    if (!name || !email || !message || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      message,
      category,
    });

    await newContact.save();

    await sendEmail({
      to: email,
      subject: "Contact Form Submission",
      text: `Thank you for reaching out, ${name}. We have received your message and will get back to you shortly.`,
    });

    await sendEmail({
      to: "sauravkumarmr.s@gmail.com",
      subject: category,
      text: `You have a new ${category} message from ${name} (${email}):\n\n ${message}`,
    });

    res.status(201).json({ message: "Contact created successfully" });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resolveContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const resolvedContact = await Contact.findByIdAndUpdate(
      id,
      { resolved: 1 },
      { new: true }
    );

    await sendEmail({
      to: contact.email,
      subject: "Contact Form Submission",
      text: `Dear ${contact.name},\n\nYour message has been resolved. Thank you for your patience.\n\nBest regards,\nSupport Team`,
    });

    if (!resolvedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact resolved successfully" });
  } catch (error) {
    console.error("Error resolving contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    const rejectedContact = await Contact.findByIdAndUpdate(
      id,
      { resolved: 0 },
      { new: true }
    );
    await sendEmail({
      to: contact.email,
      subject: "Contact Form Submission",
      text: `Dear ${contact.name},\n\nYour message has been rejected. Thank you for your understanding.\n\nBest regards,\nSupport Team`,
    });
    if (!rejectedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact rejected successfully" });
  } catch (error) {
    console.error("Error rejecting contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
