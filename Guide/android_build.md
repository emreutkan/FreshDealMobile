# Android Build Setup for macOS (Apple Silicon)

This guide will walk you through setting up your environment for building and running Android projects on **Apple
Silicon**.

---

## 1. Install Homebrew

First, install Homebrew (a package manager for macOS):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 2. Install Required Tools

### Install Java (OpenJDK 17)

```bash
brew install openjdk@17
```

---

### 3. Set Up `JAVA_HOME`

Add the Java environment variable to your shell configuration:

```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

Verify the Java version:

```bash
java -version
```

---

### 4. Install Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio).
2. Follow the installation prompts to set up the **SDK**.

---

## 5. Set Up `ANDROID_SDK_ROOT`

Modern builds use `ANDROID_SDK_ROOT` instead of `ANDROID_HOME`. Add this to your shell configuration:

```bash
echo 'export ANDROID_SDK_ROOT=~/Library/Android/sdk' >> ~/.zshrc
source ~/.zshrc
```

---

## 6. Set Up `adb` (Android Debug Bridge)

Add the `platform-tools` path to your system's PATH variable:

```bash
echo 'export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

Verify the `adb` installation:

```bash
adb version
```

---

## 7. Prepare Your Project

Navigate to your project root in the terminal:

```bash
cd /path/to/your/project
```

Generate the native Android directories:

```bash
npx expo prebuild
```

---

## 8. Build the App

### Build AAB (Android App Bundle)

To create an AAB file:

```bash
eas build --local
```

---

### Build APK (Preview Profile)

To create an APK file:

```bash
eas build --local --profile preview
```

---

## 9. Install the APK on an Emulator or Device

### Start the Emulator

Ensure your Android emulator is running or connect a physical device via USB.

### Install the APK

Locate the generated APK file (usually in the `build` folder) and run:

```bash
adb install build.apk
```
