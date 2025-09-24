import 'environment.dart';

class AppConstants {
  // App Information
  static const String appName = 'LocallyTrip.com';
  static const String appVersion = '1.0.0';
  
  // API Configuration - Environment-based
  static String get apiUrl => Environment.apiUrl;
  static String get webUrl => Environment.webUrl;
  static String get imageBaseUrl => Environment.imageBaseUrl;
  
  // Network Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
  
  // Pagination
  static const int defaultPageSize = 10;
  static const int maxPageSize = 50;
  
  // Image Sizes
  static const double profileImageSize = 100;
  static const double tripImageHeight = 200;
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 300);
  static const Duration mediumAnimation = Duration(milliseconds: 500);
  static const Duration longAnimation = Duration(milliseconds: 800);
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String settingsKey = 'app_settings';
  
  // Trip Categories
  static const List<String> tripCategories = [
    'Adventure',
    'Culture',
    'Food',
    'Nature',
    'History',
    'Art',
    'Sports',
    'Photography',
    'Shopping',
    'Nightlife',
  ];
  
  // Trip Difficulties
  static const List<String> tripDifficulties = [
    'easy',
    'moderate',
    'challenging',
    'extreme',
  ];
  
  // User Roles
  static const String traveller = 'traveller';
  static const String host = 'host';
  static const String admin = 'admin';
  
  // Currencies
  static const List<String> supportedCurrencies = [
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
  ];
  
  // Map Configuration
  static const double defaultLatitude = 37.7749;
  static const double defaultLongitude = -122.4194;
  static const double defaultZoom = 12.0;
  
  // Error Messages
  static const String networkErrorMessage = 'Network error. Please check your connection.';
  static const String serverErrorMessage = 'Server error. Please try again later.';
  static const String unauthorizedMessage = 'You are not authorized to perform this action.';
  static const String notFoundMessage = 'The requested resource was not found.';
  
  // Success Messages
  static const String loginSuccessMessage = 'Successfully logged in!';
  static const String registrationSuccessMessage = 'Account created successfully!';
  static const String bookingSuccessMessage = 'Booking confirmed successfully!';
  
  // Regular Expressions
  static const String emailRegex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
  static const String phoneRegex = r'^\+?[1-9]\d{1,14}$';
  
  // File Upload
  static const int maxImageSizeBytes = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
}
