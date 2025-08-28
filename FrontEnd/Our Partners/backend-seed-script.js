const mongoose = require('mongoose');
require('dotenv').config();

// Partner Schema (same as in server.js)
const PartnerSchema = new mongoose.Schema({
    partnerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    products: [{ type: String }],
    keyFeatures: [{ type: String }],
    stats: {
        experience: String,
        customers: String,
        claimSettlement: String,
        networkHospitals: String,
        branches: String
    },
    established: { type: Number },
    specialty: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Partner = mongoose.model('Partner', PartnerSchema);

// Partners data to seed
const partnersData = [
    {
        partnerId: 'hdfc-ergo',
        name: 'HDFC ERGO',
        type: 'General Insurance',
        description: 'A leading general insurance company in India, offering comprehensive motor, health, and travel insurance solutions.',
        products: ['Motor Insurance', 'Health Insurance', 'Travel Insurance', 'Home Insurance', 'Commercial Insurance'],
        keyFeatures: ['Cashless claim settlements', 'Wide network of hospitals and garages', '24/7 customer support', 'Online policy management', 'Instant policy issuance'],
        stats: {
            experience: '18+ Years',
            customers: '1.5 Crore+',
            claimSettlement: '95%',
            networkHospitals: '10,000+'
        },
        established: 2002,
        specialty: 'Comprehensive general insurance with innovative digital solutions'
    },
    {
        partnerId: 'hdfc-life',
        name: 'HDFC Life',
        type: 'Life Insurance',
        description: 'One of India\'s leading life insurance companies, providing innovative life insurance solutions and retirement planning.',
        products: ['Term Life Insurance', 'Whole Life Insurance', 'ULIP Plans', 'Retirement Plans', 'Child Insurance Plans'],
        keyFeatures: ['High claim settlement ratio', 'Flexible premium payment options', 'Tax benefits under 80C and 10(10D)', 'Wide range of riders', 'Online policy servicing'],
        stats: {
            experience: '23+ Years',
            customers: '6.8 Crore+',
            claimSettlement: '98.1%',
            branches: '400+'
        },
        established: 2000,
        specialty: 'Innovative life insurance solutions with strong digital presence'
    },
    {
        partnerId: 'icici-lombard',
        name: 'ICICI Lombard',
        type: 'General Insurance',
        description: 'India\'s largest private sector general insurance company, known for innovative products and customer-centric approach.',
        products: ['Motor Insurance', 'Health Insurance', 'Home Insurance', 'Travel Insurance', 'Commercial Insurance'],
        keyFeatures: ['Advanced claim processing technology', 'Extensive service network', 'Customized insurance solutions', 'Digital-first approach', 'Quick claim settlements'],
        stats: {
            experience: '22+ Years',
            customers: '3.2 Crore+',
            claimSettlement: '97.8%',
            branches: '265+'
        },
        established: 2001,
        specialty: 'Technology-driven insurance solutions with comprehensive coverage'
    },
    {
        partnerId: 'manipal-cigna',
        name: 'Manipal Cigna',
        type: 'Health Insurance',
        description: 'A leading health insurance company focused on providing comprehensive health coverage and wellness solutions.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Group Health Insurance', 'Critical Illness Plans', 'Senior Citizen Plans'],
        keyFeatures: ['Cashless hospitalization', 'Global coverage', 'Wellness programs', 'Preventive healthcare benefits', 'No sub-limits on room rent'],
        stats: {
            experience: '12+ Years',
            customers: '25 Lakh+',
            claimSettlement: '94.2%',
            networkHospitals: '6,500+'
        },
        established: 2012,
        specialty: 'Specialized health insurance with global standards and wellness focus'
    },
    {
        partnerId: 'care-health',
        name: 'Care Health Insurance',
        type: 'Health Insurance',
        description: 'Dedicated health insurance company providing innovative and affordable health insurance solutions across India.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Group Health Insurance', 'Top-up Plans', 'Personal Accident Plans'],
        keyFeatures: ['Affordable premiums', 'Quick claim processing', 'Wide hospital network', 'Alternative treatment coverage', 'Maternity benefits'],
        stats: {
            experience: '8+ Years',
            customers: '10 Lakh+',
            claimSettlement: '92.5%',
            networkHospitals: '8,000+'
        },
        established: 2016,
        specialty: 'Affordable health insurance with comprehensive coverage and quick service'
    },
    {
        partnerId: 'niva-bupa',
        name: 'Niva Bupa Health Insurance',
        type: 'Health Insurance',
        description: 'A pure-play health insurance company committed to making healthcare accessible and affordable for everyone.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Senior Citizen Plans', 'Critical Illness Plans', 'Group Health Insurance'],
        keyFeatures: ['No waiting period for accidents', 'Restore benefit', 'Global coverage', 'Alternative medicine coverage', 'Pre and post hospitalization'],
        stats: {
            experience: '15+ Years',
            customers: '5 Lakh+',
            claimSettlement: '93.8%',
            networkHospitals: '6,000+'
        },
        established: 2008,
        specialty: 'Pure health insurance with innovative benefits and customer-centric approach'
    },
    {
        partnerId: 'star-health',
        name: 'Star Health Insurance',
        type: 'Health Insurance',
        description: 'India\'s largest standalone health insurance company, exclusively focused on health insurance solutions.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Senior Citizen Plans', 'Diabetes Care Plans', 'Cardiac Care Plans'],
        keyFeatures: ['Specialized health focus', 'Disease-specific plans', 'Comprehensive coverage', 'Quick claim settlements', 'Wide network hospitals'],
        stats: {
            experience: '17+ Years',
            customers: '1.2 Crore+',
            claimSettlement: '91.5%',
            networkHospitals: '12,000+'
        },
        established: 2006,
        specialty: 'Largest standalone health insurer with specialized disease-specific plans'
    }
];

async function seedPartners() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing partners
        await Partner.deleteMany({});
        console.log('Cleared existing partners');

        // Insert new partners
        const insertedPartners = await Partner.insertMany(partnersData);
        console.log(`Inserted ${insertedPartners.length} partners successfully`);

        // List inserted partners
        insertedPartners.forEach(partner => {
            console.log(`- ${partner.name} (${partner.type})`);
        });

    } catch (error) {
        console.error('Error seeding partners:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seed function
if (require.main === module) {
    seedPartners();
}

module.exports = { seedPartners, partnersData };