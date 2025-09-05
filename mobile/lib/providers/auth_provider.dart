import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService;
  
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;
  bool _isLoading = false;
  String? _error;
  
  AuthProvider(this._apiService);
  
  // Getters
  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Login
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await _apiService.login(email, password);
      
      if (response['token'] != null) {
        _apiService.setAuthToken(response['token']);
        _user = response['user'];
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      
      return false;
    } catch (e) {
      _error = e.toString();
      
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Register
  Future<bool> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String role = 'traveller',
  }) async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await _apiService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      );
      
      if (response['token'] != null) {
        _apiService.setAuthToken(response['token']);
        _user = response['user'];
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      
      return false;
    } catch (e) {
      _error = e.toString();
      
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Logout
  Future<void> logout() async {
    _apiService.clearAuthToken();
    _user = null;
    _isAuthenticated = false;
    _error = null;
    notifyListeners();
  }
  
  // Get current user profile
  Future<void> getProfile() async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await _apiService.getProfile();
      _user = response['user'];
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      
    } finally {
      _setLoading(false);
    }
  }
  
  // Check if user is host
  bool get isHost => _user?['role'] == 'host';
  
  // Check if user is admin
  bool get isAdmin => _user?['role'] == 'admin';
  
  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
