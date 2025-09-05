import 'package:flutter/foundation.dart';
import '../models/trip.dart';
import '../services/api_service.dart';

class TripProvider with ChangeNotifier {
  final ApiService _apiService;
  
  List<Trip> _trips = [];
  List<Trip> _filteredTrips = [];
  bool _isLoading = false;
  String? _error;
  
  TripProvider(this._apiService);
  
  // Getters
  List<Trip> get trips => _filteredTrips.isEmpty ? _trips : _filteredTrips;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Fetch all trips
  Future<void> fetchTrips() async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await _apiService.getTrips();
      _trips = response;
      _filteredTrips = [];
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      
    } finally {
      _setLoading(false);
    }
  }
  
  // Search trips
  void searchTrips(String query) {
    if (query.isEmpty) {
      _filteredTrips = [];
    } else {
      _filteredTrips = _trips.where((trip) {
        final titleMatch = trip.title.toLowerCase().contains(query.toLowerCase());
        final descriptionMatch = trip.description.toLowerCase().contains(query.toLowerCase());
        final categoryMatch = trip.category.toLowerCase().contains(query.toLowerCase());
        final cityMatch = trip.location.city.toLowerCase().contains(query.toLowerCase());
        final tagsMatch = trip.tags.any((tag) => tag.toLowerCase().contains(query.toLowerCase()));
        
        return titleMatch || descriptionMatch || categoryMatch || cityMatch || tagsMatch;
      }).toList();
    }
    notifyListeners();
  }
  
  // Filter trips by category
  void filterByCategory(String category) {
    if (category.isEmpty) {
      _filteredTrips = [];
    } else {
      _filteredTrips = _trips.where((trip) {
        return trip.category.toLowerCase() == category.toLowerCase();
      }).toList();
    }
    notifyListeners();
  }
  
  // Filter trips by price range
  void filterByPriceRange(double minPrice, double maxPrice) {
    _filteredTrips = _trips.where((trip) {
      return trip.price >= minPrice && trip.price <= maxPrice;
    }).toList();
    notifyListeners();
  }
  
  // Filter trips by difficulty
  void filterByDifficulty(String difficulty) {
    if (difficulty.isEmpty) {
      _filteredTrips = [];
    } else {
      _filteredTrips = _trips.where((trip) {
        return trip.difficulty.toLowerCase() == difficulty.toLowerCase();
      }).toList();
    }
    notifyListeners();
  }
  
  // Get trip by ID
  Trip? getTripById(String id) {
    try {
      return _trips.firstWhere((trip) => trip.id == id);
    } catch (e) {
      return null;
    }
  }
  
  // Get featured trips
  List<Trip> getFeaturedTrips() {
    return _trips.where((trip) => trip.featured).toList();
  }
  
  // Get trips by host
  List<Trip> getTripsByHost(String hostId) {
    return _trips.where((trip) => trip.host.id == hostId).toList();
  }
  
  // Clear filters
  void clearFilters() {
    _filteredTrips = [];
    notifyListeners();
  }
  
  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
