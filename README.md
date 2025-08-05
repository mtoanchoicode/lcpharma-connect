# Long Châu PMS - Mobile Pharmacy Management System

A modern mobile-first pharmacy management system built with React, TypeScript, and Capacitor for cross-platform mobile deployment.

## Project info

**URL**: https://lovable.dev/projects/6b893cbb-51f7-44e0-9049-3755404b1da9

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Mode

To run the project in development mode with hot reload:

```bash
npm run dev
```

This will start the development server at `http://localhost:8080`

### 4. Build for Production

```bash
npm run build
```

## Mobile Development Setup

This project uses Capacitor for native mobile app development.

### Initial Mobile Setup

After cloning and installing dependencies, sync the project with mobile platforms:

```bash
npx cap sync
```

### Add Mobile Platforms

If you haven't added the mobile platforms yet:

```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android
```

### Update Native Dependencies

When you pull new changes or add new Capacitor plugins:

```bash
# Update iOS dependencies
npx cap update ios

# Update Android dependencies
npx cap update android
```

### Running on Mobile Devices

#### Android

1. Make sure you have Android Studio installed
2. Build the project:
   ```bash
   npm run build
   ```
3. Sync with Capacitor:
   ```bash
   npx cap sync android
   ```
4. Run on Android device/emulator:
   ```bash
   npx cap run android
   ```

#### iOS

1. Make sure you have Xcode installed (macOS required)
2. Build the project:
   ```bash
   npm run build
   ```
3. Sync with Capacitor:
   ```bash
   npx cap sync ios
   ```
4. Run on iOS device/simulator:
   ```bash
   npx cap run ios
   ```

### Alternative: Open in Native IDE

You can also open the project directly in the native IDEs:

```bash
# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

## Development Workflow

### For Web Development
1. Make changes to your code
2. Test in browser with `npm run dev`
3. Build with `npm run build`

### For Mobile Development
1. Make changes to your code
2. Build the project: `npm run build`
3. Sync changes: `npx cap sync`
4. Test on device: `npx cap run android` or `npx cap run ios`

## Other Development Options

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6b893cbb-51f7-44e0-9049-3755404b1da9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6b893cbb-51f7-44e0-9049-3755404b1da9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
