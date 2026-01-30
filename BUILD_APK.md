# Building APK Without Android Studio

## Method 1: Command Line Build (Fastest)

### Prerequisites
1. **Java JDK 17+**: Download from https://adoptium.net/
2. **Android SDK Command Line Tools**: Download from https://developer.android.com/studio#command-tools

### Steps

1. **Verify Java is installed:**
```bash
java -version
```
Should show Java 17 or higher.

2. **Set ANDROID_HOME environment variable:**
```bash
# Windows PowerShell
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
```

3. **Build the APK:**
```bash
cd android
./gradlew assembleDebug
```

4. **Find your APK:**
The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK (for distribution)
```bash
cd android
./gradlew assembleRelease
```

## Method 2: Using Android Studio (Recommended)

### Why Android Studio is Better:
- ✅ Automatically installs Java, SDK, and all dependencies
- ✅ Easy APK signing for Google Play Store
- ✅ Built-in emulator for testing
- ✅ Visual debugging tools
- ✅ One-click builds

### Steps:
1. Download Android Studio: https://developer.android.com/studio
2. Open the project: `npm run open:android`
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK will be in `android/app/build/outputs/apk/`

## Method 3: GitHub Actions (Automated)

Create `.github/workflows/build-android.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build web assets
      run: npm run build
    
    - name: Build Android APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

Push to GitHub and the APK will build automatically!

## Quick Comparison

| Method | Difficulty | Setup Time | Best For |
|--------|-----------|------------|----------|
| Command Line | Medium | 30-60 min | Developers familiar with CLI |
| Android Studio | Easy | 15 min | Beginners, testing, production |
| GitHub Actions | Medium | 20 min | Automated builds, CI/CD |

## Recommendation

**For your first APK:** Use Android Studio
- It's the easiest and most reliable
- Handles everything automatically
- You'll need it for testing anyway

**For automated builds:** Use GitHub Actions
- Great for continuous deployment
- No local setup needed
- Free for public repositories

## Testing the APK

Once you have the APK file:

1. **On a real device:**
   - Enable "Install from Unknown Sources" in Settings
   - Transfer the APK to your phone
   - Tap to install

2. **On an emulator:**
   - Drag and drop the APK onto the emulator window
   - Or use: `adb install path/to/app-debug.apk`

## Next Steps

1. **Debug APK** (for testing): `./gradlew assembleDebug`
2. **Release APK** (for distribution): Requires signing with a keystore
3. **AAB Bundle** (for Google Play): `./gradlew bundleRelease`
