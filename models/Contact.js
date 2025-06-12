const mongoose = require("mongoose");

// Define the Contact Schema
const contactSchema = new mongoose.Schema(
  {
    // Basic contact information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true, // Removes whitespace from beginning and end
      maxLength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No duplicate emails allowed
      lowercase: true, // Converts to lowercase
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please provide a valid phone number"],
    },

    // Optional fields
    address: {
      street: {
        type: String,
        trim: true,
        maxLength: [100, "Street address cannot exceed 100 characters"],
      },
      city: {
        type: String,
        trim: true,
        maxLength: [50, "City cannot exceed 50 characters"],
      },
      state: {
        type: String,
        trim: true,
        maxLength: [50, "State cannot exceed 50 characters"],
      },
      zipCode: {
        type: String,
        trim: true,
        maxLength: [10, "Zip code cannot exceed 10 characters"],
      },
      country: {
        type: String,
        trim: true,
        maxLength: [50, "Country cannot exceed 50 characters"],
        default: "USA",
      },
    },

    // Additional contact info
    company: {
      type: String,
      trim: true,
      maxLength: [100, "Company name cannot exceed 100 characters"],
    },

    jobTitle: {
      type: String,
      trim: true,
      maxLength: [100, "Job title cannot exceed 100 characters"],
    },

    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },

    // Categories/Tags for organizing contacts
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // System fields (automatically managed)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields

    // Transform the output when converting to JSON
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better search performance
contactSchema.index({ email: 1 }); // Index on email for fast lookups
contactSchema.index({ firstName: 1, lastName: 1 }); // Compound index for name searches
contactSchema.index({ tags: 1 }); // Index for tag-based searches

// Instance method - gets full name
contactSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

// Static method - find contacts by tag
contactSchema.statics.findByTag = function (tag) {
  return this.find({ tags: { $in: [tag] } });
};

// Pre-save middleware - runs before saving
contactSchema.pre("save", function (next) {
  // Capitalize first letter of names
  if (this.firstName) {
    this.firstName =
      this.firstName.charAt(0).toUpperCase() +
      this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName =
      this.lastName.charAt(0).toUpperCase() +
      this.lastName.slice(1).toLowerCase();
  }
  next();
});

// Create and export the model
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
