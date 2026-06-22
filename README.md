# Pritech React Native Task Manager

A simple React Native task management app built with Expo SDK 54, TypeScript, and Expo Router.

## Features

- View a list of tasks fetched from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos)
- Add new tasks with title and description validation
- Mark tasks as completed or pending
- Delete tasks
- View task details
- Empty, loading, and error states

## Requirements

- Node.js 20+
- npm
- [Expo Go](https://expo.dev/go) on your phone (SDK 54 — available on the App Store / Play Store)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go (Android) or the Camera app (iOS).

You can also run on web:

```bash
npx expo start --web
```

## Project structure

```
src/
  app/              # Expo Router screens
  components/tasks/ # Task-specific UI components
  contexts/         # Shared React context providers
  hooks/              # Custom hooks
  services/api/       # API fetch and mapping
  types/              # TypeScript interfaces
  utils/              # Validation helpers
```

## Tech stack

- React Native + Expo SDK 54
- TypeScript
- Expo Router (stack navigation)
- JSONPlaceholder public API

## Screenshots

Add screenshots or a short screen recording here before submission.
