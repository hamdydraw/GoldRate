# Gold Rate Tracker - Mobile App

A beautiful Gold Rate tracking application for Android and iOS.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (already installed ✓)
- **For Android**: [Android Studio](https://developer.android.com/studio)
- **For iOS**: macOS with [Xcode](https://developer.apple.com/xcode/) (iOS builds only work on Mac)

## 📱 Running the App

### Android
1. Make sure Android Studio is installed
2. Run: `npm run open:android`
3. In Android Studio, click the green "Run" button
4. Select an emulator or connected device

### iOS (Mac only)
1. Make sure Xcode is installed
2. Run: `npm run open:ios`
3. In Xcode, select a simulator or device
4. Click the "Play" button

## 🔄 Development Workflow

### Making Changes
1. Edit your files: `index.html`, `style.css`, `script.js`
2. Run: `npm run build`
3. Rebuild in Android Studio or Xcode

### Quick Commands
- `npm run build` - Copy files to www and sync with native projects
- `npm run sync` - Sync web assets to native projects
- `npm run open:android` - Open Android Studio
- `npm run open:ios` - Open Xcode

## 📦 Project Structure
```
GoldRate/
├── index.html          # Main HTML file
├── style.css           # Styles
├── script.js           # JavaScript logic
├── www/                # Build output (copied files)
├── android/            # Android native project
├── ios/                # iOS native project
└── capacitor.config.json  # Capacitor configuration
```

## 🔧 Troubleshooting

### CORS Issues
If you encounter CORS errors when making API calls:
1. Install: `npm install @capacitor/http`
2. Update `script.js` to use Capacitor's HTTP client

### Port Already in Use
If you see port errors, just ignore them - Capacitor doesn't need a dev server.

## 📚 Resources
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Xcode Guide](https://developer.apple.com/xcode/)

## 🎯 Next Steps
1. **Test on Android**: Open Android Studio and run the app
2. **Test on iOS**: (Mac only) Open Xcode and run the app
3. **Customize**: Update app icon and splash screen
4. **Deploy**: Build release versions for Google Play and App Store
