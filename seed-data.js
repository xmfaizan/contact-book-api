// Seed script to populate database with sample data
const mongoose = require('mongoose');
require('dotenv').config();
const Contact = require('./models/contact');

// Sample contacts data
const sampleContacts = [
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@example.com",
        phone: "+1234567890",
        address: {
            street: "123 Tech Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA"
        },
        company: "TechCorp",
        jobTitle: "Software Engineer",
        notes: "Full-stack developer specializing in React and Node.js",
        tags: ["work", "developer", "tech"]
    },
    {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.smith@example.com",
        phone: "+1987654321",
        address: {
            street: "456 Design Ave",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
        },
        company: "Creative Studio",
        jobTitle: "UI/UX Designer",
        notes: "Excellent eye for design and user experience",
        tags: ["work", "design", "creative"]
    },
    {
        firstName: "Carol",
        lastName: "Davis",
        email: "carol.davis@example.com",
        phone: "+1555123456",
        address: {
            street: "789 Business Blvd",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA"
        },
        company: "Marketing Plus",
        jobTitle: "Marketing Manager",
        notes: "Great at digital marketing campaigns",
        tags: ["work", "marketing", "manager"]
    },
    {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@example.com",
        phone: "+1777888999",
        address: {
            street: "321 Friend Lane",
            city: "Austin",
            state: "TX",
            zipCode: "73301",
            country: "USA"
        },
        company: "Freelancer",
        jobTitle: "Photographer",
        notes: "Amazing wedding and portrait photographer",
        tags: ["friend", "photographer", "creative"]
    },
    {
        firstName: "Emma",
        lastName: "Brown",
        email: "emma.brown@example.com",
        phone: "+1666555444",
        address: {
            street: "654 Family Road",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
            country: "USA"
        },
        company: "Healthcare Corp",
        jobTitle: "Nurse",
        notes: "Family friend and healthcare professional",
        tags: ["family", "healthcare", "friend"]
    }
];

// Connect to database and seed data
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing contacts
        await Contact.deleteMany({});
        console.log('🗑️  Cleared existing contacts');

        // Insert sample contacts
        const contacts = await Contact.insertMany(sampleContacts);
        console.log(`📝 Created ${contacts.length} sample contacts`);

        // Display created contacts
        console.log('\n📋 Sample Contacts Created:');
        contacts.forEach((contact, index) => {
            console.log(`${index + 1}. ${contact.getFullName()} - ${contact.email}`);
        });

        console.log('\n🎉 Database seeded successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
};

// Run if called directly
if (require.main === module) {
    console.log('🌱 Starting database seed...\n');
    seedDatabase();
}

module.exports = { sampleContacts, seedDatabase };