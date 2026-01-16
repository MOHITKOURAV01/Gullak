# Gullak Mobile App

A premium React Native mobile application for personal finance management, built with Expo.

## Features

- **EMI Calculator**: Calculate loan EMIs with AI-powered insights
- **Expense Tracker**: Monitor daily expenses with visual analytics
- **Debt Optimizer**: Strategize loan repayments using Avalanche or Snowball methods
- **Premium UI**: Dark theme with glassmorphism effects matching the web version

## Tech Stack

- React Native (Expo)
- NativeWind (Tailwind CSS for React Native)
- React Navigation
- Expo Linear Gradient
- Lucide React Native Icons
- React Native Reanimated

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Navigate to the MobileApp directory:
   ```bash
   cd MobileApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## Project Structure

```
MobileApp/
├── src/
│   ├── components/
│   │   └── common/          # Reusable components
│   ├── screens/             # Main app screens
│   ├── navigation/          # Navigation configuration
│   ├── utils/               # Utility functions
│   └── constants/           # Theme and constants
├── App.js                   # Main app entry
└── package.json
```

## Design System

The app maintains consistency with the Gullak website:
- **Primary Color**: Gold (#FFD700)
- **Secondary Color**: Green (#10B981)
- **Background**: Dark (#0A0A0A)
- **Surface**: Dark Gray (#171717)

## Contributing

This is part of the Gullak financial management platform.
