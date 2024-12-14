# FreshDealMobile

## Tech Stack

![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

```aiignore
npm install
npm install -g eas-cli
npx expo-doctor
npm install -g expo-cli
npx expo install --check

```

## Build Locally

```aiignore
expo prebuild
```

- open /android in android studio
- Go to the top toolbar and select Build → Build Bundle(s)/APK(s) → Build APK.

then Start the Expo development server and Launch the app on your device/emulator. It will connect to your development
server.

```aiignore
npx expo start --dev-client
```

press a to open android amulator

- and run

```aiignore
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Build Using EAS

### Build Development (Debug Mode):

```bash
eas build --platform android --profile development
```

### Build Production:

If you want to generate an AAB instead of an APK for production:

```bash
eas build --platform android --profile production
```

### **APK vs AAB**

| **Feature**      | **APK**                         | **AAB**                                    |
|------------------|---------------------------------|--------------------------------------------|
| **Installation** | Directly installable.           | Cannot install directly; needs processing. |
| **Size**         | Larger, contains all resources. | Smaller after optimization.                |
| **Use Case**     | Local testing, sideloading.     | Publishing on Google Play Store.           |

# Clean local build android

type this in powershell to set JAVA_HOME

```powershell

$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

```aiignore
cd android
./gradle clean
./gradlew assembleDebug
```
