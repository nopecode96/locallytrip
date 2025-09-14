const { Sequelize, DataTypes } = require('sequelize');

// Use DATABASE_URL for production (DigitalOcean) or individual config for development
let sequelize;
if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL from DigitalOcean
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Development: Use individual config
  sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'localtrip',
    username: process.env.DB_USER || 'localtrip_user',
    password: process.env.DB_PASSWORD || 'localtrip_password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  });
}

// Import all models first
const Country = require('./Country')(sequelize, DataTypes);
const City = require('./City')(sequelize, DataTypes);
const Language = require('./Language')(sequelize, DataTypes);
const HostCategory = require('./HostCategory')(sequelize, DataTypes);
const ExperienceType = require('./ExperienceType')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const UserLanguage = require('./UserLanguage')(sequelize, DataTypes);
const UserHostCategory = require('./UserHostCategory')(sequelize, DataTypes);
const Experience = require('./Experience')(sequelize, DataTypes);
const ExperienceItinerary = require('./ExperienceItinerary')(sequelize, DataTypes);
const Story = require('./Story')(sequelize, DataTypes);
const StoryLike = require('./StoryLike')(sequelize, DataTypes);
const StoryComment = require('./StoryComment')(sequelize, DataTypes);
const Booking = require('./Booking')(sequelize, DataTypes);
const GuideBooking = require('./GuideBooking')(sequelize, DataTypes);
const PhotographyBooking = require('./PhotographyBooking')(sequelize, DataTypes);
const TripPlannerBooking = require('./TripPlannerBooking')(sequelize, DataTypes);
const ComboBooking = require('./ComboBooking')(sequelize, DataTypes);
const Payment = require('./Payment')(sequelize, DataTypes);
const Bank = require('./Bank')(sequelize, DataTypes);
const UserBankAccount = require('./UserBankAccount')(sequelize, DataTypes);
const PayoutSettings = require('./PayoutSettings')(sequelize, DataTypes);
const PayoutHistory = require('./PayoutHistory')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);
const FAQ = require('./FAQ')(sequelize, DataTypes);
const FeaturedHost = require('./FeaturedHost')(sequelize, DataTypes);
const FeaturedTestimonial = require('./FeaturedTestimonial')(sequelize, DataTypes);
const Newsletter = require('./Newsletter')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);
const UserSession = require('./UserSession')(sequelize, DataTypes);
const SecurityEvent = require('./SecurityEvent')(sequelize, DataTypes);

// Store models in db object
const db = {
  Country,
  City,
  Language,
  HostCategory,
  ExperienceType,
  Role,
  User,
  UserLanguage,
  UserHostCategory,
  Experience,
  ExperienceItinerary,
  Story,
  StoryLike,
  StoryComment,
  Booking,
  GuideBooking,
  PhotographyBooking,
  TripPlannerBooking,
  ComboBooking,
  Payment,
  Bank,
  UserBankAccount,
  PayoutSettings,
  PayoutHistory,
  Review,
  FAQ,
  FeaturedHost,
  FeaturedTestimonial,
  Newsletter,
  AuditLog,
  UserSession,
  SecurityEvent,
  sequelize,
  Sequelize
};

// Define all associations after all models are loaded
// Country relationships
Country.hasMany(City, { 
  foreignKey: 'country_id', 
  as: 'cities' 
});
City.belongsTo(Country, { 
  foreignKey: 'country_id', 
  as: 'country'  // lowercase to match query
});

// User-City relationships
City.hasMany(User, { 
  foreignKey: 'city_id', 
  as: 'users' 
});
User.belongsTo(City, { 
  foreignKey: 'city_id', 
  as: 'City'  // Capital C to match existing code
});

// User-Language many-to-many relationships
User.belongsToMany(Language, {
  through: UserLanguage,
  foreignKey: 'user_id',
  otherKey: 'language_id',
  as: 'languages'
});
Language.belongsToMany(User, {
  through: UserLanguage,
  foreignKey: 'language_id',
  otherKey: 'user_id',
  as: 'users'
});

// Direct associations for junction table
UserLanguage.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});
UserLanguage.belongsTo(Language, { 
  foreignKey: 'language_id', 
  as: 'language' 
});

// Experience relationships
User.hasMany(Experience, { 
  foreignKey: 'host_id', 
  as: 'hostedExperiences' 
});
Experience.belongsTo(User, { 
  foreignKey: 'host_id', 
  as: 'host' 
});

HostCategory.hasMany(Experience, { 
  foreignKey: 'category_id', 
  as: 'experiences' 
});
Experience.belongsTo(HostCategory, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

ExperienceType.hasMany(Experience, { 
  foreignKey: 'experience_type_id', 
  as: 'experiences' 
});
Experience.belongsTo(ExperienceType, { 
  foreignKey: 'experience_type_id', 
  as: 'experienceType' 
});

City.hasMany(Experience, { 
  foreignKey: 'city_id', 
  as: 'experiences' 
});
Experience.belongsTo(City, { 
  foreignKey: 'city_id', 
  as: 'city' 
});

// Experience Itinerary relationships
Experience.hasMany(ExperienceItinerary, { 
  foreignKey: 'experience_id', 
  as: 'itinerary' 
});
ExperienceItinerary.belongsTo(Experience, { 
  foreignKey: 'experience_id', 
  as: 'experience' 
});

// Story relationships
User.hasMany(Story, { 
  foreignKey: 'authorId', 
  as: 'stories' 
});
Story.belongsTo(User, { 
  foreignKey: 'authorId', 
  as: 'author' 
});

// Story-City relationships
City.hasMany(Story, { 
  foreignKey: 'cityId', 
  as: 'stories' 
});
Story.belongsTo(City, { 
  foreignKey: 'cityId', 
  as: 'City' 
});

// Story Like relationships
User.hasMany(StoryLike, { 
  foreignKey: 'user_id', 
  as: 'storyLikes' 
});
StoryLike.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

Story.hasMany(StoryLike, { 
  foreignKey: 'story_id', 
  as: 'likes' 
});
StoryLike.belongsTo(Story, { 
  foreignKey: 'story_id', 
  as: 'story' 
});

// Story Comment relationships
User.hasMany(StoryComment, { 
  foreignKey: 'user_id', 
  as: 'storyComments' 
});
StoryComment.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

Story.hasMany(StoryComment, { 
  foreignKey: 'story_id', 
  as: 'comments' 
});
StoryComment.belongsTo(Story, { 
  foreignKey: 'story_id', 
  as: 'story' 
});

// Self-referencing for reply comments
StoryComment.hasMany(StoryComment, { 
  foreignKey: 'parent_id', 
  as: 'replies' 
});
StoryComment.belongsTo(StoryComment, { 
  foreignKey: 'parent_id', 
  as: 'parent' 
});

// Booking relationships
User.hasMany(Booking, { 
  foreignKey: 'user_id', 
  as: 'bookings' 
});
Booking.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'traveler' 
});

Experience.hasMany(Booking, { 
  foreignKey: 'experience_id', 
  as: 'bookings' 
});
Booking.belongsTo(Experience, { 
  foreignKey: 'experience_id', 
  as: 'experience' 
});

// Payment relationships
Booking.hasMany(Payment, { 
  foreignKey: 'booking_id', 
  as: 'payments' 
});
Payment.belongsTo(Booking, { 
  foreignKey: 'booking_id', 
  as: 'booking' 
});

User.hasMany(Payment, { 
  foreignKey: 'user_id', 
  as: 'madePayments' 
});
Payment.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'payer' 
});

// Review relationships
User.hasMany(Review, { 
  foreignKey: 'reviewer_id', 
  as: 'givenReviews' 
});
Review.belongsTo(User, { 
  foreignKey: 'reviewer_id', 
  as: 'reviewer' 
});

Experience.hasMany(Review, { 
  foreignKey: 'experience_id', 
  as: 'reviews' 
});
Review.belongsTo(Experience, { 
  foreignKey: 'experience_id', 
  as: 'experience' 
});

Booking.hasOne(Review, { 
  foreignKey: 'booking_id', 
  as: 'review' 
});
Review.belongsTo(Booking, { 
  foreignKey: 'booking_id', 
  as: 'booking' 
});

// FeaturedHost relationships
FeaturedHost.belongsTo(User, {
  foreignKey: 'host_id',
  as: 'host'
});

User.hasOne(FeaturedHost, {
  foreignKey: 'host_id',
  as: 'featuredProfile'
});

// FeaturedTestimonial relationships
FeaturedTestimonial.belongsTo(User, {
  foreignKey: 'reviewer_id',
  as: 'reviewer'
});

FeaturedTestimonial.belongsTo(Experience, {
  foreignKey: 'experience_id',
  as: 'experience'
});

User.hasMany(FeaturedTestimonial, {
  foreignKey: 'reviewer_id',
  as: 'featuredTestimonials'
});

Experience.hasMany(FeaturedTestimonial, {
  foreignKey: 'experience_id',
  as: 'featuredTestimonials'
});

// Role relationships
Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'userRole'
});

// UserHostCategory relationships
UserHostCategory.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserHostCategory.belongsTo(HostCategory, {
  foreignKey: 'host_category_id',
  as: 'hostCategory'
});

User.belongsToMany(HostCategory, {
  through: UserHostCategory,
  foreignKey: 'user_id',
  otherKey: 'host_category_id',
  as: 'hostCategories'
});

HostCategory.belongsToMany(User, {
  through: UserHostCategory,
  foreignKey: 'host_category_id',
  otherKey: 'user_id',
  as: 'hosts'
});

// Newsletter relationships
User.hasOne(Newsletter, {
  foreignKey: 'user_id',
  as: 'newsletterSubscription'
});

Newsletter.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// AuditLog relationships
User.hasMany(AuditLog, {
  foreignKey: 'user_id',
  as: 'auditLogs'
});

AuditLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// UserSession relationships
User.hasMany(UserSession, {
  foreignKey: 'user_id',
  as: 'sessions'
});

UserSession.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// SecurityEvent relationships
User.hasMany(SecurityEvent, {
  foreignKey: 'user_id',
  as: 'securityEvents'
});

SecurityEvent.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

SecurityEvent.belongsTo(User, {
  foreignKey: 'resolved_by',
  as: 'resolver'
});

// Bank relationships
UserBankAccount.belongsTo(Bank, {
  foreignKey: 'bank_id',
  as: 'bank'
});

Bank.hasMany(UserBankAccount, {
  foreignKey: 'bank_id',
  as: 'userAccounts'
});

// User Bank Account relationships
User.hasMany(UserBankAccount, {
  foreignKey: 'user_id',
  as: 'bankAccounts'
});

UserBankAccount.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Payout Settings relationships
User.hasOne(PayoutSettings, {
  foreignKey: 'user_id',
  as: 'payoutSettings'
});

PayoutSettings.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Payout History relationships
User.hasMany(PayoutHistory, {
  foreignKey: 'user_id',
  as: 'payoutHistory'
});

PayoutHistory.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

PayoutHistory.belongsTo(UserBankAccount, {
  foreignKey: 'user_bank_account_id',
  as: 'bankAccount'
});

UserBankAccount.hasMany(PayoutHistory, {
  foreignKey: 'user_bank_account_id',
  as: 'payouts'
});

module.exports = db;
