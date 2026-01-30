---
description: Deploy Gold Rate app to Android and iOS using Capacitor
---

# Deploy to Android & iOS with Capacitor

## ✅ Setup Already Complete!

The project is already configured with Capacitor. You can skip to "Running the App" below.

## 📱 Running the App

### Android
// turbo
1. Open Android Studio:
```bash
npm run open:android
```

2. In Android Studio:
   - Wait for Gradle sync to complete (first time takes 5-10 minutes)
   - Click the green ▶️ "Run" button
   - Select an emulator or connected device

### iOS (Mac Only)
// turbo
1. Open Xcode:
```bash
npm run open:ios
```

2. In Xcode:
   - Select a simulator or device from the top toolbar
   - Click the ▶️ "Play" button

## 🔄 Development Workflow

### Making Changes
When you edit `index.html`, `style.css`, or `script.js`:

// turbo
1. Build and sync:
```bash
npm run build
```

2. Rebuild in Android Studio or Xcode (click the ▶️ button again)

## 📦 Available Commands

// turbo-all
- `npm run build` - Copy files to www/ and sync with native projects
- `npm run sync` - Sync web assets to native projects only
- `npm run open:android` - Open project in Android Studio
- `npm run open:ios` - Open project in Xcode

## 🎯 Prerequisites

### For Android
- **Android Studio**: Download from https://developer.android.com/studio
- **Android SDK**: Installed automatically with Android Studio
- **Emulator**: Set up in Android Studio (Tools → Device Manager)

### For iOS (Mac Only)
- **macOS**: Required for iOS development
- **Xcode**: Download from Mac App Store
- **iOS Simulator**: Included with Xcode

## 🔧 Troubleshooting

### CORS Issues
If you encounter CORS errors when making API calls from the mobile app:

1. Install Capacitor HTTP plugin:
```bash
npm install @capacitor/http
```

2. Update `script.js` to use Capacitor's HTTP client instead of fetch.

### Gradle Sync Failed (Android)
- Make sure you have Java 17 or higher installed
- In Android Studio: File → Invalidate Caches → Restart

### Build Errors
- Clean the project: In Android Studio (Build → Clean Project) or Xcode (Product → Clean Build Folder)
- Delete and re-sync: `npm run build`

## 📱 Building for Production

### Android APK/AAB
1. Open Android Studio
2. Build → Generate Signed Bundle / APK
3. Follow the wizard to create a keystore and build
4. Output will be in `android/app/build/outputs/`

### iOS App Store
1. Open Xcode
2. Product → Archive
3. Follow the wizard to submit to App Store Connect
4. Requires Apple Developer account ($99/year)

## 🎨 Customization

### App Icon
- Android: Replace files in `android/app/src/main/res/mipmap-*/`
- iOS: Replace files in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Splash Screen
- Android: Edit `android/app/src/main/res/drawable/splash.png`
- iOS: Edit `ios/App/App/Assets.xcassets/Splash.imageset/`

### App Name
Edit `capacitor.config.json`:
```json
{
  "appName": "Your New Name"
}
```
Then run `npm run sync`

## 📚 Resources
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Development](https://developer.android.com/studio/intro)
- [iOS Development](https://developer.apple.com/xcode/)

