const { sequelize, Category, Service, User, ServiceProvider, Booking, Review, CommunityForum, ForumComment } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const hashedPassword = await bcrypt.hash('password123', 10);
        const providerPassword = await bcrypt.hash('123456', 10);

        // 1. Create Users (Locals & Newcomers) - Check if they exist first
        const userExists = await User.findOne({ where: { email: 'user@example.com' } });
        if (userExists) {
            console.log('Users already exist, skipping user creation.');
            return; // Exit early if seeded data is already present to avoid duplicates
        }

        const user1 = await User.create({
            ufname: 'Rahul', ulname: 'Reddy', email: 'user@example.com', password: hashedPassword,
            phone_number: '9876543210', address: 'Madhapur, Hyderabad'
        });
        const user2 = await User.create({
            ufname: 'Priya', ulname: 'Sharma', email: 'priya@example.com', password: hashedPassword,
            phone_number: '9876543211', address: 'Gachibowli, Hyderabad'
        });

        console.log('Users created.');

        // 2. Create Service Providers (Verified)
        const providers = [
            { sname: 'Hyderabad Home Services', email: 'provider@example.com', phone: '9988776655', address: 'Kukatpally, Hyderabad', is_verified: true },
            { sname: 'Gachibowli Packers', email: 'packers@example.com', phone: '9988776656', address: 'Gachibowli, Hyderabad', is_verified: true },
            { sname: 'City Plumbers', email: 'plumber@example.com', phone: '9988776657', address: 'Banjara Hills, Hyderabad', is_verified: true },
            { sname: 'Cool Breeze AC Repair', email: 'ac@example.com', phone: '9988776658', address: 'Hitech City, Hyderabad', is_verified: true },
            { sname: 'Sparkle Cleaning', email: 'clean@example.com', phone: '9988776659', address: 'Jubilee Hills, Hyderabad', is_verified: true },
            { sname: 'Glamour Salon at Home', email: 'beauty@example.com', phone: '9988776660', address: 'Kondapur, Hyderabad', is_verified: true },
            { sname: 'Quick Fix Electronics', email: 'electric@example.com', phone: '9988776661', address: 'Begumpet, Hyderabad', is_verified: true },
            { sname: 'Safe Pest Control', email: 'pest@example.com', phone: '9988776662', address: 'Secunderabad, Hyderabad', is_verified: true },
        ];

        const createdProviders = [];
        for (const p of providers) {
            createdProviders.push(await ServiceProvider.create({ ...p, password: providerPassword }));
        }

        console.log('Providers created.');

        // 3. Create Categories
        const categoriesData = [
            'Home Cleaning', 'Plumbing', 'Electrical', 'Carpentry',
            'Appliance Repair', 'Pest Control', 'Painting',
            'Packers & Movers', 'Beauty & Salon', 'Tiffin Service',
            'Food & Dining', 'Education & Tuition', 'Stationery',
            'Groceries', 'Medical & Pharmacy', 'Shopping',
            'Transport & Cab', 'Temples & Spiritual', 'Yoga & Wellness',
            'Pet Care', 'Home Security', 'Architecture', 'Interior Design',
            'Legal Services', 'Accounting', 'Event Planning', 'Photography',
            'Catering', 'Fitness Training', 'Music Classes', 'Dance Academy',
            'Language Learning', 'Real Estate', 'Car Wash & Detail',
            'Laundry & Dry Cleaning', 'Computer Repair', 'Mobile Repair',
            'AC & HVAC Services', 'Gardening & Landscaping', 'Waste Management',
            'Elderly Care', 'Baby Sitting', 'Masonry', 'Welding', 'Locksmith',
            'Glass & Mirror Services', 'Flooring Installation', 'Roofing',
            'Pool Maintenance', 'Handyman Services', 'IT Consulting',
            'Marketing & SEO', 'Graphic Design', 'Video Editing',
            'Mobile App Development', 'Web Development', 'Content Writing'
        ];

        const categories = {};
        for (const name of categoriesData) {
            categories[name] = await Category.create({ cat_name: name });
        }

        console.log('Categories created.');

        // 4. Create Services
        const servicesData = [
            // Home Cleaning
            { name: 'Water Tank Cleaning', cat: 'Home Cleaning', sp: 0, price: 1500, desc: 'Professional mechanized water tank cleaning (up to 1000L).', lat: 17.4486, lng: 78.3908, addr: 'Flat 101, Madhapur Main Rd, Hyderabad' },
            { name: 'Full Home Deep Cleaning (2BHK)', cat: 'Home Cleaning', sp: 4, price: 4500, desc: 'Complete deep cleaning of floor, washrooms, and kitchen.', lat: 17.4150, lng: 78.4350, addr: 'Road No. 1, Banjara Hills, Hyderabad' },

            // Plumbing
            { name: 'Tap Repair/Installation', cat: 'Plumbing', sp: 2, price: 300, desc: 'Fixing leaking taps or installing new ones.', lat: 17.4520, lng: 78.3683, addr: 'Near Sharath City Mall, Kondapur, Hyderabad' },

            // Electrical
            { name: 'Fan Installation', cat: 'Electrical', sp: 6, price: 250, desc: 'Installation of ceiling or wall fans.', lat: 17.4399, lng: 78.4983, addr: 'Near Railway Station, Secunderabad' },

            // Food & Dining
            { name: 'Paradise Biryani', cat: 'Food & Dining', sp: 0, price: 350, desc: 'World famous Hyderabadi Biryani.', lat: 17.4411, lng: 78.4874, addr: 'Paradise Circle, Secunderabad' },
            { name: 'Chutneys', cat: 'Food & Dining', sp: 0, price: 200, desc: 'Authentic South Indian Breakfast and Meals.', lat: 17.4325, lng: 78.4070, addr: 'Road No. 36, Jubilee Hills, Hyderabad' },

            // Education
            { name: 'Maths Home Tuition (Class 10)', cat: 'Education & Tuition', sp: 1, price: 5000, desc: 'Experienced tutor for CBSE/ICSE Math.', lat: 17.4948, lng: 78.3996, addr: 'KPHB Phase 1, Kukatpally, Hyderabad' },
            { name: 'IELTS Coaching', cat: 'Education & Tuition', sp: 1, price: 8000, desc: 'Comprehensive IELTS preparation course.', lat: 17.4354, lng: 78.4475, addr: 'Beside Meto Station, Ameerpet, Hyderabad' },

            // Medical
            { name: 'Apollo Pharmacy', cat: 'Medical & Pharmacy', sp: 5, price: 0, desc: '24/7 Pharmacy with home delivery.', lat: 17.4296, lng: 78.4124, addr: 'Film Nagar, Jubilee Hills, Hyderabad' },
            { name: 'General Physician Consultation', cat: 'Medical & Pharmacy', sp: 5, price: 500, desc: 'Online or visit consultation.', lat: 17.4326, lng: 78.4071, addr: 'Jubilee Hills Checkpost, Hyderabad' },

            // Groceries
            { name: 'Ratnadeep Supermarket', cat: 'Groceries', sp: 4, price: 0, desc: 'Fresh vegetables and daily essentials.', lat: 17.4401, lng: 78.3489, addr: 'DLF Cyber City Rd, Gachibowli, Hyderabad' },

            // Temples
            { name: 'Birla Mandir', cat: 'Temples & Spiritual', sp: 7, price: 0, desc: 'Lord Venkateswara Temple on Naubat Pahad.', lat: 17.4062, lng: 78.4690, addr: 'Adarsh Nagar, Hyderabad' },
            { name: 'Chilkur Balaji Temple', cat: 'Temples & Spiritual', sp: 7, price: 0, desc: 'Visa Balaji Temple.', lat: 17.3697, lng: 78.2917, addr: 'Chilkur, Telangana' },

            // Transport
            { name: 'Airport Cab Transfer', cat: 'Transport & Cab', sp: 3, price: 1200, desc: 'Drop to RGIA Airport from anywhere in city.', lat: 17.2403, lng: 78.4294, addr: 'Shamshabad, Hyderabad' },

            // Shopping
            { name: 'Inorbit Mall', cat: 'Shopping', sp: 2, price: 0, desc: 'Premium shopping mall with top brands.', lat: 17.4345, lng: 78.3840, addr: 'Inorbit Mall Rd, Hitech City, Hyderabad' },

            // Stationery
            { name: 'Himalaya Book World', cat: 'Stationery', sp: 1, price: 0, desc: 'Books, art supplies, and office stationery.', lat: 17.4269, lng: 78.4507, addr: 'Punjagutta, Hyderabad' }
        ];

        for (const s of servicesData) {
            await Service.create({
                service_name: s.name,
                cat_id: categories[s.cat].cat_id,
                spid: createdProviders[s.sp].spid,
                description: s.desc,
                price: s.price,
                is_active: true,
                is_bookable: s.cat !== 'Temples & Spiritual',
                image: s.cat === 'Temples & Spiritual'
                    ? 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=80'
                    : s.cat === 'Food & Dining'
                        ? 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1581578731522-9945ff16a042?auto=format&fit=crop&w=800&q=80',
                latitude: s.lat,
                longitude: s.lng,
                address: s.addr
            });
        }

        console.log('Services created.');

        // 5. Create Forum Posts
        await CommunityForum.create({
            uid: user1.uid,
            title: 'Best Place for Biryani near Hitech City?',
            content: 'I just moved here and looking for authentic Hyderabadi Biryani recommendations near Hitech City/Madhapur.'
        });

        await CommunityForum.create({
            uid: user2.uid,
            title: 'PGs near Raidurg Metro Station',
            content: 'Any suggestions for good PGs with food near Raidurg? Budget around 15k.'
        });

        console.log('Forum posts created.');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
