const { Service, Category, ServiceProvider, Review, Booking, User } = require('../models');
const aiSpamCheck = require('../utils/aiSpamCheck');

exports.createService = async (req, res) => {
    try {
        const { service_name, cat_id, description, price, image } = req.body;
        const spid = req.user.id; // Assumes req.user is populated by authMiddleware

        if (req.user.role !== 'ServiceProvider') {
            return res.status(403).json({ message: 'Only Service Providers can create services' });
        }

        // AI Spam Check for description
        const spamResult = await aiSpamCheck(description + " " + service_name);
        if (spamResult.isSpam) {
            return res.status(400).json({
                message: 'Service creation rejected by AI safety layer.',
                reason: spamResult.reason
            });
        }

        const newService = await Service.create({
            service_name,
            cat_id,
            spid,
            description,
            price,
            image
        });

        res.status(201).json(newService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [
                { model: Category, attributes: ['cat_name'] },
                { model: ServiceProvider, attributes: ['sname', 'is_verified'] }
            ],
            where: { is_active: true, status: 'approved' }
        });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[DEBUG] getServiceById called with ID: "${id}" (Type: ${typeof id})`);

        if (!id || id === 'undefined') {
            console.error("[DEBUG] Invalid ID passed to getServiceById");
            return res.status(400).json({ message: 'Invalid Service ID' });
        }

        const service = await Service.findByPk(id, {
            include: [
                { model: Category, attributes: ['cat_name'] },
                {
                    model: ServiceProvider,
                    attributes: ['spid', 'sname', 'email', 'phone', 'address', 'is_verified', 'profile_pic', 'documents']
                }
            ]
        });

        if (!service) {
            console.warn(`[DEBUG] No service found for ID: ${id}`);
            return res.status(404).json({ message: 'Service not found in database. Please check if the ID is correct.' });
        }

        const reviews = await Review.findAll({
            include: [
                {
                    model: Booking,
                    where: { service_id: id },
                    attributes: []
                },
                {
                    model: User,
                    attributes: ['ufname', 'ulname', 'profile_pic']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
            : 0;

        console.log(`Found service: ${service.service_name}, Reviews: ${reviewCount}, Rating: ${averageRating}`);

        res.json({
            ...service.toJSON(),
            reviews,
            reviewCount,
            averageRating
        });
    } catch (error) {
        console.error("Error in getServiceById:", error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            stack: error.stack // Temporary for debugging
        });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { service_name, cat_id, description, price, is_active, image } = req.body;
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.spid !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this service' });
        }

        await service.update({
            service_name,
            cat_id,
            description,
            price,
            is_active,
            image
        });

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.spid !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this service' });
        }

        // Soft delete by setting is_active to false instead of actual delete? 
        // Or actual delete. Let's do actual delete as per standard CRUD, but maybe check for bookings?
        // Basic requirement: "Add / Update / Delete services"

        await service.destroy();
        res.json({ message: 'Service deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getServicesByProvider = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { spid: req.user.id },
            include: [{ model: Category, attributes: ['cat_name'] }]
        });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProviderProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await ServiceProvider.findByPk(id, {
            attributes: ['spid', 'sname', 'email', 'phone', 'address', 'is_verified', 'createdAt'],
            include: [{ model: Category, attributes: ['cat_name'] }]
        });

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        const services = await Service.findAll({
            where: { spid: id, is_active: true },
            include: [{ model: Category, attributes: ['cat_name'] }]
        });

        const { Review, Booking, User } = require('../models');

        const reviews = await Review.findAll({
            include: [
                {
                    model: Booking,
                    where: { spid: id },
                    attributes: []
                },
                {
                    model: User,
                    attributes: ['ufname', 'ulname']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            provider,
            services,
            reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyProvider = async (req, res) => {
    try {
        const spid = req.user.spid || req.user.id;
        await ServiceProvider.update({ is_verified: true }, { where: { spid } });
        res.json({ message: 'Documents uploaded and provider verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['cat_name', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
