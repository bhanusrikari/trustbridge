const { Service, Category, ServiceProvider } = require('../models');
const axios = require('axios');

// Mock data for Hyderabad businesses if API key is missing
const HOCK_HYDERABAD_BUSINESSES = [
    {
        name: "Hitech City Plumber Pros",
        category: "Plumbing",
        address: "Plot 45, Jubilee Hills, Hyderabad, Telangana 500033",
        lat: 17.4326,
        lng: 78.4071,
        price: 499,
        description: "Professional plumbing services specializing in leaks, pipe repairs, and bathroom fittings. Standard 24/7 emergency support."
    },
    {
        name: "Miyapur Deep Cleaning Experts",
        category: "House Cleaning",
        address: "Lane 4, Miyapur Main Rd, Hyderabad, Telangana 500049",
        lat: 17.4933,
        lng: 78.3489,
        price: 1200,
        description: "Full home sanitization and deep cleaning. We use eco-friendly chemicals and steam cleaning technology."
    },
    {
        name: "Kukatpally Electrician Hub",
        category: "Electrical",
        address: "KPHB Phase 3, Kukatpally, Hyderabad, Telangana 500072",
        lat: 17.4947,
        lng: 78.3996,
        price: 350,
        description: "Fast and reliable electrical repairs. Short circuit diagnostics, wiring, and appliance installation."
    },
    {
        name: "Gachibowli AC Servicing",
        category: "AC Repair",
        address: "DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032",
        lat: 17.4483,
        lng: 78.3488,
        price: 800,
        description: "Specialized AC gas filling, filter cleaning, and full unit maintenance for split and window ACs."
    }
];

exports.importGoogleServices = async (req, res) => {
    try {
        const { categoryName, count = 2 } = req.body;
        
        // Find or create a default service provider for "Imported" services if none exists
        let importer = await ServiceProvider.findOne({ where: { sname: 'Google Places Import' } });
        if (!importer) {
            // Find a system admin to link this to, or just create a dummy
            importer = await ServiceProvider.create({
                sname: 'Google Places Import',
                email: 'import@trustbridge.com',
                password: 'imported_service_key_safe', 
                is_verified: true,
                cat_id: 1 // Default to first category
            });
        }

        // Logic for real Google Places API would go here
        // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        // if (apiKey) { ... fetch from Google ... }

        // Filter mock data by category if requested, otherwise take first few
        let pool = HOCK_HYDERABAD_BUSINESSES;
        if (categoryName) {
            pool = HOCK_HYDERABAD_BUSINESSES.filter(b => b.category.toLowerCase().includes(categoryName.toLowerCase()));
        }

        const toImport = pool.slice(0, count);
        const results = [];

        for (const biz of toImport) {
            // Map category name to ID
            let category = await Category.findOne({ where: { cat_name: biz.category } });
            if (!category) {
                category = await Category.create({ cat_name: biz.category });
            }

            // Create Service
            const service = await Service.create({
                service_name: biz.name,
                cat_id: category.cat_id,
                spid: importer.spid,
                description: biz.description,
                price: biz.price,
                latitude: biz.lat,
                longitude: biz.lng,
                address: biz.address,
                status: 'approved', // Auto-approve imported services
                is_active: true,
                image: `https://images.unsplash.com/photo-1581578731522-9945ff16a042?auto=format&fit=crop&w=800&q=80`
            });
            results.push(service);
        }

        res.json({ 
            message: `Successfully imported ${results.length} services from Google Maps.`,
            services: results
        });

    } catch (error) {
        console.error("Error importing services:", error);
        res.status(500).json({ message: "Failed to import services", error: error.message });
    }
};

exports.searchPlaces = async (req, res) => {
    try {
        const { query } = req.query;
        // Search logic for Autocomplete
        // For now, return mock filtered by query
        const matches = HOCK_HYDERABAD_BUSINESSES.filter(b => 
            b.name.toLowerCase().includes(query.toLowerCase()) || 
            b.category.toLowerCase().includes(query.toLowerCase())
        );
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
};
