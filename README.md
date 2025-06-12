Contact Book API

A simple REST API for managing contacts built with Node.js, Express, and MongoDB. This project demonstrates CRUD operations, data validation, search functionality, and MongoDB integration.
🚀 Features

    Create, Read, Update, Delete contacts
    Search functionality by name, email, or company
    Data validation with Mongoose schemas
    Pagination for large datasets
    Soft delete (contacts marked as inactive instead of permanent deletion)
    Error handling with proper HTTP status codes
    MongoDB Atlas cloud database integration

🛠️ Tech Stack

    Backend: Node.js, Express.js
    Database: MongoDB with Mongoose ODM
    Development: Nodemon for auto-restart
    Testing: Postman

📁 Project Structure

contact-book-api/
├── models/
│ └── Contact.js # Contact schema and model
├── routes/
│ └── contacts.js # API routes and controllers
├── config/
│ └── database.js # Database connection configuration
├── .env # Environment variables
├── .gitignore # Git ignore file
├── server.js # Main server file
├── package.json # Dependencies and scripts
└── README.md # Project documentation
