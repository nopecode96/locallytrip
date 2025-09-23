# Admin Panel for Featured Content Management

This admin panel allows for the management of featured content on the homepage of LocallyTrip.com. The following sections can be managed:

## Sections

1. **Featured Experiences**
   - Manage featured travel experiences, including adding, editing, and removing experiences.

2. **Favorite Cities**
   - Manage a list of favorite cities that travelers can explore.

3. **Meet Our Expert Hosts**
   - Feature specific hosts who provide unique travel experiences.

4. **Travel Stories Featured**
   - Manage featured travel stories shared by travelers.

5. **What Travelers Say**
   - Manage testimonials and feedback from travelers.

## Authentication

To access the admin panel, use the following credentials:

- **Username:** admin
- **Password:** password123

## Getting Started

1. Clone the repository and navigate to the `admin` directory.
2. Install dependencies using `npm install`.
3. Start the development server with `npm run dev`.
4. Access the admin panel at [http://localhost:3002](http://localhost:3002).

## File Structure

- **src/app/api/auth/route.ts**: Handles authentication routes.
- **src/app/homepage-content/page.tsx**: Manages homepage content.
- **src/app/login/page.tsx**: Renders the login page.
- **src/components/admin/**: Contains components for managing different content sections.
- **src/hooks/**: Custom hooks for authentication and content management.
- **src/lib/**: Utility functions for authentication and mock data.

## Development Notes

- Ensure to keep the admin password secure and change it in production environments.
- Use the provided mock data for testing purposes during development.