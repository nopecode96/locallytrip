import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class UserProvider with ChangeNotifier {
  final ApiService _apiService;
  
  Map<String, dynamic>? _profile;
  bool _isLoading = false;
  String? _error;
  
  UserProvider(this._apiService);
  
  // Getters
  Map<String, dynamic>? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Update user profile
  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    _setLoading(true);
    _error = null;
    
    try {
      // This would call a profile update endpoint
      // For now, we'll simulate the update
      _profile = {...(_profile ?? {}), ...profileData};
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Get user bookings
  Future<List<Map<String, dynamic>>> getUserBookings() async {
    _setLoading(true);
    _error = null;
    
    try {
      final bookings = await _apiService.getUserBookings();
      return bookings;
    } catch (e) {
      _error = e.toString();
      
      return [];
    } finally {
      _setLoading(false);
    }
  }
  
  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
