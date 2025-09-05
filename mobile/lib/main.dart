import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'providers/trip_provider.dart';
import 'providers/user_provider.dart';
import 'services/api_service.dart';
import 'utils/app_router.dart';
import 'utils/app_theme.dart';
import 'utils/constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  final apiService = ApiService();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AuthProvider(apiService),
        ),
        ChangeNotifierProvider(
          create: (context) => TripProvider(apiService),
        ),
        ChangeNotifierProvider(
          create: (context) => UserProvider(apiService),
        ),
      ],
      child: const LocallyTripApp(),
    ),
  );
}

class LocallyTripApp extends StatelessWidget {
  const LocallyTripApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: AppRouter.router,
    );
  }
}
