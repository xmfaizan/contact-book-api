const express = require("express");
const Contact = require("../models/contact");
const router = express.Router();

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const { search, tag, page = 1, limit = 10 } = req.query;

    // Build search query
    let query = { isActive: true }; // Only get active contacts

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } }, // Case-insensitive search
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .limit(limit * 1) // Convert to number
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get total count for pagination info
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      error: "Server Error - Could not fetch contacts",
    });
  }
});

// @desc    Get single contact by ID
// @route   GET /api/contacts/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact || !contact.isActive) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error - Could not fetch contact",
    });
  }
});

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public
router.post("/", async (req, res) => {
  try {
    // Extract data from request body
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      company,
      jobTitle,
      notes,
      tags,
    } = req.body;

    // Check if contact with this email already exists
    const existingContact = await Contact.findOne({
      email: email.toLowerCase(),
    });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        error: "Contact with this email already exists",
      });
    }

    // Create new contact
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      company,
      jobTitle,
      notes,
      tags: tags ? tags.map((tag) => tag.toLowerCase()) : [],
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: messages,
      });
    }

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Contact with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error - Could not create contact",
    });
  }
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    // Check if contact exists
    let contact = await Contact.findById(req.params.id);

    if (!contact || !contact.isActive) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    // If email is being updated, check for duplicates
    if (req.body.email && req.body.email !== contact.email) {
      const existingContact = await Contact.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id }, // Exclude current contact
      });

      if (existingContact) {
        return res.status(400).json({
          success: false,
          error: "Another contact with this email already exists",
        });
      }
    }

    // Update contact
    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validations
    });

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: messages,
      });
    }

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error - Could not update contact",
    });
  }
});

// @desc    Delete contact (soft delete)
// @route   DELETE /api/contacts/:id
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact || !contact.isActive) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    // Soft delete - just mark as inactive
    await Contact.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error - Could not delete contact",
    });
  }
});

// @desc    Search contacts by name
// @route   GET /api/contacts/search/:term
// @access  Public
router.get("/search/:term", async (req, res) => {
  try {
    const searchTerm = req.params.term;

    const contacts = await Contact.find({
      isActive: true,
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { company: { $regex: searchTerm, $options: "i" } },
      ],
    }).sort({ firstName: 1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    res.status(500).json({
      success: false,
      error: "Server Error - Could not search contacts",
    });
  }
});

module.exports = router;
