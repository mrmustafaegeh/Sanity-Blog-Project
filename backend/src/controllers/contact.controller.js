import Contact from "../models/Contact.js";

// Create a new contact message (Public)
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message.",
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all messages (Admin)
export const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Optional: Filter by unread
    const isRead = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined;
    const filter = isRead !== undefined ? { isRead } : {};

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      contacts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting contacts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a message (Admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark message as read (Admin)
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Marked as read",
      contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
