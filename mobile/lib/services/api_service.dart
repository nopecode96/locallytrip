import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/trip.dart';
import '../utils/constants.dart';

class ApiService {
  final String baseUrl;
  String? _authToken;
  
  ApiService({String? baseUrl}) : baseUrl = baseUrl ?? AppConstants.apiUrl;
  
  // Set authentication token
  void setAuthToken(String token) {
    _authToken = token;
  }
  
  // Clear authentication token
  void clearAuthToken() {
    _authToken = null;
  }
  
  // Get headers with authentication
  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    
    return headers;
  }
  
  // Handle API response
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    } else {
      final errorBody = json.decode(response.body);
      throw ApiException(
        message: errorBody['message'] ?? 'Unknown error occurred',
        statusCode: response.statusCode,
      );
    }
  }
  
  // Auth endpoints
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String role = 'traveller',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: json.encode({
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'role': role,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/profile'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }
  
  // Trip endpoints
  Future<List<Trip>> getTrips({
    int page = 1,
    int limit = 10,
    String? category,
    String? city,
    double? minPrice,
    double? maxPrice,
    String? difficulty,
    bool? featured,
    String? search,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };
    
    if (category != null) queryParams['category'] = category;
    if (city != null) queryParams['city'] = city;
    if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
    if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
    if (difficulty != null) queryParams['difficulty'] = difficulty;
    if (featured != null) queryParams['featured'] = featured.toString();
    if (search != null) queryParams['search'] = search;
    
    final uri = Uri.parse('$baseUrl/trips').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    final data = _handleResponse(response);
    final trips = (data['trips'] as List)
        .map((tripJson) => Trip.fromJson(tripJson))
        .toList();
    
    return trips;
  }
  
  Future<Trip> getTripById(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/trips/$id'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return Trip.fromJson(data['trip']);
  }
  
  Future<List<Trip>> getTripsByHost(String hostId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/trips/host/$hostId'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    final trips = (data['trips'] as List)
        .map((tripJson) => Trip.fromJson(tripJson))
        .toList();
    
    return trips;
  }
  
  Future<Trip> createTrip(Map<String, dynamic> tripData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/trips'),
      headers: _headers,
      body: json.encode(tripData),
    );
    
    final data = _handleResponse(response);
    return Trip.fromJson(data['trip']);
  }
  
  Future<Trip> updateTrip(String id, Map<String, dynamic> tripData) async {
    final response = await http.put(
      Uri.parse('$baseUrl/trips/$id'),
      headers: _headers,
      body: json.encode(tripData),
    );
    
    final data = _handleResponse(response);
    return Trip.fromJson(data['trip']);
  }
  
  Future<void> deleteTrip(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/trips/$id'),
      headers: _headers,
    );
    
    _handleResponse(response);
  }
  
  // Booking endpoints (placeholder for future implementation)
  Future<Map<String, dynamic>> createBooking({
    required String tripId,
    required int participants,
    required DateTime bookingDate,
    String? specialRequests,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/bookings'),
      headers: _headers,
      body: json.encode({
        'tripId': tripId,
        'participants': participants,
        'bookingDate': bookingDate.toIso8601String(),
        'specialRequests': specialRequests,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<List<Map<String, dynamic>>> getUserBookings() async {
    final response = await http.get(
      Uri.parse('$baseUrl/bookings/user'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return List<Map<String, dynamic>>.from(data['bookings']);
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  
  ApiException({
    required this.message,
    required this.statusCode,
  });
  
  @override
  String toString() => 'ApiException($statusCode): $message';
}
