# CoachPlus

A mobile application for managing sports teams, built with React Native and Expo.

## Features

- Multi-role authentication (Admin, Coach, Parent)
- Team management
- Player profiles
- Event scheduling
- Payment tracking
- Announcements
- Chat functionality

## Tech Stack

- React Native
- Expo
- TypeScript
- Supabase (Backend & Authentication)
- React Navigation

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd CoachPlus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create a `.env` file in the root directory
- Add your Supabase configuration:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npx expo start
```

## Database Schema

### Tables
- users
- teams
- players
- parents
- events
- payments
- announcements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 