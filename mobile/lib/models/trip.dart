class Trip {
  final String id;
  final String title;
  final String description;
  final String shortDescription;
  final double price;
  final String currency;
  final int duration;
  final int maxParticipants;
  final String difficulty;
  final String category;
  final List<String> tags;
  final TripLocation location;
  final List<String> images;
  final List<String> included;
  final List<String> excluded;
  final List<String> requirements;
  final List<ItineraryItem> itinerary;
  final bool isActive;
  final bool featured;
  final double averageRating;
  final int totalReviews;
  final Host host;
  final DateTime createdAt;
  final DateTime updatedAt;

  Trip({
    required this.id,
    required this.title,
    required this.description,
    this.shortDescription = '',
    required this.price,
    this.currency = 'USD',
    required this.duration,
    required this.maxParticipants,
    this.difficulty = 'easy',
    required this.category,
    this.tags = const [],
    required this.location,
    this.images = const [],
    this.included = const [],
    this.excluded = const [],
    this.requirements = const [],
    this.itinerary = const [],
    this.isActive = true,
    this.featured = false,
    this.averageRating = 0.0,
    this.totalReviews = 0,
    required this.host,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      shortDescription: json['short_description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'USD',
      duration: json['duration'] ?? 0,
      maxParticipants: json['max_participants'] ?? 0,
      difficulty: json['difficulty'] ?? 'easy',
      category: json['category'] ?? '',
      tags: List<String>.from(json['tags'] ?? []),
      location: TripLocation.fromJson(json['location'] ?? {}),
      images: List<String>.from(json['images'] ?? []),
      included: List<String>.from(json['included'] ?? []),
      excluded: List<String>.from(json['excluded'] ?? []),
      requirements: List<String>.from(json['requirements'] ?? []),
      itinerary: (json['itinerary'] as List<dynamic>?)
          ?.map((item) => ItineraryItem.fromJson(item))
          .toList() ?? [],
      isActive: json['is_active'] ?? true,
      featured: json['featured'] ?? false,
      averageRating: (json['average_rating'] ?? 0).toDouble(),
      totalReviews: json['total_reviews'] ?? 0,
      host: Host.fromJson(json['host'] ?? {}),
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updated_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'short_description': shortDescription,
      'price': price,
      'currency': currency,
      'duration': duration,
      'max_participants': maxParticipants,
      'difficulty': difficulty,
      'category': category,
      'tags': tags,
      'location': location.toJson(),
      'images': images,
      'included': included,
      'excluded': excluded,
      'requirements': requirements,
      'itinerary': itinerary.map((item) => item.toJson()).toList(),
      'is_active': isActive,
      'featured': featured,
      'average_rating': averageRating,
      'total_reviews': totalReviews,
      'host': host.toJson(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  String get formattedPrice => '\$${price.toStringAsFixed(2)}';
  String get formattedDuration {
    final hours = duration ~/ 60;
    final minutes = duration % 60;
    if (hours > 0 && minutes > 0) {
      return '${hours}h ${minutes}m';
    } else if (hours > 0) {
      return '${hours}h';
    } else {
      return '${minutes}m';
    }
  }
}

class TripLocation {
  final String address;
  final String city;
  final String country;
  final Coordinates coordinates;

  TripLocation({
    required this.address,
    required this.city,
    required this.country,
    required this.coordinates,
  });

  factory TripLocation.fromJson(Map<String, dynamic> json) {
    return TripLocation(
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      country: json['country'] ?? '',
      coordinates: Coordinates.fromJson(json['coordinates'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'city': city,
      'country': country,
      'coordinates': coordinates.toJson(),
    };
  }
}

class Coordinates {
  final double lat;
  final double lng;

  Coordinates({
    required this.lat,
    required this.lng,
  });

  factory Coordinates.fromJson(Map<String, dynamic> json) {
    return Coordinates(
      lat: (json['lat'] ?? 0).toDouble(),
      lng: (json['lng'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
    };
  }
}

class ItineraryItem {
  final String time;
  final String activity;
  final String description;

  ItineraryItem({
    required this.time,
    required this.activity,
    required this.description,
  });

  factory ItineraryItem.fromJson(Map<String, dynamic> json) {
    return ItineraryItem(
      time: json['time'] ?? '',
      activity: json['activity'] ?? '',
      description: json['description'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'time': time,
      'activity': activity,
      'description': description,
    };
  }
}

class Host {
  final String id;
  final String firstName;
  final String lastName;
  final String? profileImage;
  final String email;

  Host({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profileImage,
    required this.email,
  });

  factory Host.fromJson(Map<String, dynamic> json) {
    return Host(
      id: json['id'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      profileImage: json['profile_image'],
      email: json['email'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'first_name': firstName,
      'last_name': lastName,
      'profile_image': profileImage,
      'email': email,
    };
  }

  String get fullName => '$firstName $lastName';
}
