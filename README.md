# Pritech React Native Task Manager

A modern React Native task management app built with Expo SDK 54, TypeScript, and Expo Router.

## Features

### Core requirements
- Task list with interactive stats dashboard (total, pending, completed, completion %)
- Add and **edit** tasks with title and description validation
- Mark tasks as completed or pending
- Delete tasks
- Task details screen
- Fetch starter tasks from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) (3 English tasks)
- Empty, loading, and error states

### Starter tasks (English)
- Buy groceries
- Code today
- Finish that task today

### Bonus features
- Search tasks by title
- Filter by status via dashboard stat cards or filter chips
- Persist tasks locally with AsyncStorage
- Stack navigation between list, details, add, and edit screens

### UI extras
- Modern indigo/slate color system with soft dark mode (no pure black)
- Tap Total / Pending / Done stat cards to filter the list instantly
- Relative dates on list items (Today, Yesterday)
- Contextual filter summary (e.g. "Showing 2 pending tasks")
- Live completion progress bar on the home screen

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
  app/                 # Expo Router screens (list, details, add, edit)
  components/tasks/    # Task UI (list, form, dashboard, toolbar)
  contexts/            # Shared React context providers
  hooks/               # Custom hooks
  services/
    api/               # JSONPlaceholder fetch and mapping
    storage/           # AsyncStorage persistence
  types/               # TypeScript interfaces
  utils/               # Validation, filters, stats, date formatting
```

## Tech stack

- React Native + Expo SDK 54
- TypeScript
- Expo Router (stack navigation)
- JSONPlaceholder public API
- AsyncStorage for on-device persistence

## Screenshots

Add 2–3 screenshots before submission:
1. Home screen with stats dashboard and task list
2. Add or edit task form
3. Task details screen

Replace this section with your images or a short screen recording link.

## What was implemented

This app fulfills the Pritech React Native technical task: full CRUD task management (including edit), API integration, input validation, reusable components, hooks-based state, and all four bonus features. The UI includes an interactive completion dashboard, relative dates, and a cohesive design system to demonstrate attention to detail beyond the minimum requirements.
