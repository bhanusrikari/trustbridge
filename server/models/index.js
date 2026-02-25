const { sequelize } = require('../config/db');

const User = require('./User');
const LocalResident = require('./LocalResident');
const ServiceProvider = require('./ServiceProvider');
const Admin = require('./Admin');
const Category = require('./Category');
const Service = require('./Service');
const Booking = require('./Booking');
const Review = require('./Review');
const CommunityForum = require('./CommunityForum');
const ForumComment = require('./ForumComment');
const LocalGuidanceChat = require('./LocalGuidanceChat');
const Complaint = require('./Complaint');
const Notification = require('./Notification');
const ProviderLocation = require('./ProviderLocation');
const Message = require('./Message');

// Associations

// Services
Category.hasMany(Service, { foreignKey: 'cat_id' });
Service.belongsTo(Category, { foreignKey: 'cat_id' });

ServiceProvider.hasMany(Service, { foreignKey: 'spid' });
Service.belongsTo(ServiceProvider, { foreignKey: 'spid' });

Category.hasMany(ServiceProvider, { foreignKey: 'cat_id' });
ServiceProvider.belongsTo(Category, { foreignKey: 'cat_id' });

// Bookings
User.hasMany(Booking, { foreignKey: 'uid' });
Booking.belongsTo(User, { foreignKey: 'uid' });

ServiceProvider.hasMany(Booking, { foreignKey: 'spid' });
Booking.belongsTo(ServiceProvider, { foreignKey: 'spid' });

Service.hasMany(Booking, { foreignKey: 'service_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });

// Reviews
User.hasMany(Review, { foreignKey: 'uid' });
Review.belongsTo(User, { foreignKey: 'uid' });

Booking.hasOne(Review, { foreignKey: 'booking_id' });
Review.belongsTo(Booking, { foreignKey: 'booking_id' });

// Provider Location
Booking.hasMany(ProviderLocation, { foreignKey: 'booking_id' });
ProviderLocation.belongsTo(Booking, { foreignKey: 'booking_id' });

ServiceProvider.hasMany(ProviderLocation, { foreignKey: 'spid' });
ProviderLocation.belongsTo(ServiceProvider, { foreignKey: 'spid' });

// Community Forum
User.hasMany(CommunityForum, { foreignKey: 'uid', constraints: false });
CommunityForum.belongsTo(User, { foreignKey: 'uid', constraints: false });

LocalResident.hasMany(CommunityForum, { foreignKey: 'uid', constraints: false });
CommunityForum.belongsTo(LocalResident, { foreignKey: 'uid', constraints: false });

ServiceProvider.hasMany(CommunityForum, { foreignKey: 'uid', constraints: false });
CommunityForum.belongsTo(ServiceProvider, { foreignKey: 'uid', constraints: false });

Admin.hasMany(CommunityForum, { foreignKey: 'uid', constraints: false });
CommunityForum.belongsTo(Admin, { foreignKey: 'uid', constraints: false });

CommunityForum.hasMany(ForumComment, { foreignKey: 'post_id' });
ForumComment.belongsTo(CommunityForum, { foreignKey: 'post_id' });

User.hasMany(ForumComment, { foreignKey: 'uid', constraints: false });
ForumComment.belongsTo(User, { foreignKey: 'uid', constraints: false });

LocalResident.hasMany(ForumComment, { foreignKey: 'uid', constraints: false });
ForumComment.belongsTo(LocalResident, { foreignKey: 'uid', constraints: false });

ServiceProvider.hasMany(ForumComment, { foreignKey: 'uid', constraints: false });
ForumComment.belongsTo(ServiceProvider, { foreignKey: 'uid', constraints: false });

Admin.hasMany(ForumComment, { foreignKey: 'uid', constraints: false });
ForumComment.belongsTo(Admin, { foreignKey: 'uid', constraints: false });

// Local Guidance Chat
User.hasMany(LocalGuidanceChat, { foreignKey: 'uid' });
LocalGuidanceChat.belongsTo(User, { foreignKey: 'uid' });

LocalResident.hasMany(LocalGuidanceChat, { foreignKey: 'lrid' });
LocalGuidanceChat.belongsTo(LocalResident, { foreignKey: 'lrid' });

// Complaints
User.hasMany(Complaint, { foreignKey: 'uid' });
Complaint.belongsTo(User, { foreignKey: 'uid' });

// Notifications
User.hasMany(Notification, { foreignKey: 'uid', constraints: false });
Notification.belongsTo(User, { foreignKey: 'uid', constraints: false });

LocalResident.hasMany(Notification, { foreignKey: 'uid', constraints: false });
Notification.belongsTo(LocalResident, { foreignKey: 'uid', constraints: false });

ServiceProvider.hasMany(Notification, { foreignKey: 'uid', constraints: false });
Notification.belongsTo(ServiceProvider, { foreignKey: 'uid', constraints: false });

// Messages
Message.belongsTo(User, { foreignKey: 'sender_id', constraints: false });
Message.belongsTo(ServiceProvider, { foreignKey: 'sender_id', constraints: false });
Message.belongsTo(LocalResident, { foreignKey: 'sender_id', constraints: false });

module.exports = {
    sequelize,
    User,
    LocalResident,
    ServiceProvider,
    Admin,
    Category,
    Service,
    Booking,
    Review,
    CommunityForum,
    ForumComment,
    LocalGuidanceChat,
    Complaint,
    Notification,
    ProviderLocation,
    Message
};
