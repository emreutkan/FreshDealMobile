# Side load Expo Development Build to iOS instead of using Expo go

This guide covers setting up Java, Ruby, CocoaPods, and Xcode for building and sideloading an iOS project locally.

---

## 1. Install Java

Install the latest version of Java

```bash
brew install openjdk@17
```

Make sure OpenJDK is symlinked correctly to JavaVirtualMachines

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Set JAVA_HOME

```aiignore
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"
source ~/.zshrc
```

/Library/Java/JavaVirtualMachines is where macOS looks for JDK installations by default.

---

## 2. Install Ruby

Install the latest version of Ruby using Homebrew:

```bash
brew install ruby
```

After installing, Homebrew will usually output the installation path:

```
/opt/homebrew/opt/ruby/bin
```

Add the new Ruby version to your shell configuration to ensure it takes precedence:

```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"' >> ~/.zshrc
source ~/.zshrc
```

### Verify the Ruby Installation

Run the following command to ensure you're using the correct Ruby version:

```bash
ruby -v
```

You should see the latest Ruby version, e.g., `3.3.6`. If not, repeat the steps or troubleshoot for errors.

---

## 3. Install CocoaPods

CocoaPods is required to manage iOS project dependencies.

Install it using the following command:

```bash
sudo gem install cocoapods
```

If CocoaPods is not recognized globally, add its executable path to your shell configuration:

```aiignore
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify the installation:

```bash
pod --version
```

---

## 4. Install Xcode Command Line Tools

Ensure Xcode Command Line Tools are installed:

```bash
xcode-select --install
```

Follow the prompts to complete the installation.

---

## 5. Enable Developer Mode on Your iPhone

1. Go to **Settings > Privacy & Security**.
2. Scroll down to **Developer Mode** and enable it.
3. Follow the prompts to restart your device.

---

## 6. Prepare the Project

Generate the iOS directory for your Expo project using:

```bash
npx expo prebuild
```

This will create an `ios` directory within your project.

---

## 7. Install CocoaPods Dependencies

Navigate to the newly created `ios` directory:

```bash
cd ios
```

Run CocoaPods to install the project dependencies:

```bash
pod install
```

---

## 8. Open the Project in Xcode

Navigate to the `ios` directory and open the project using Xcode:

```bash
open reactnativeexpoapp.xcworkspace
```

> **Note**: Always open the `.xcworkspace` file, **not** the `.xcodeproj` file when CocoaPods is used.

---
