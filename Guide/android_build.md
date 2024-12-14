# for macos (APPLE SILICON)

# android build

## installs

1. homebrew

 ```aiignore
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

```

2. Android Studio
3. Java

```aiignore
brew install openjdk@17
```

## Setup JAVA_HOME

```aiignore
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

## Setup ANDROID_SDK_ROOT

On older systems, ANDROID_HOME was used. Most modern builds prefer ANDROID_SDK_ROOT.

```aiignore
echo 'export ANDROID_SDK_ROOT=~/Library/Android/sdk' >> ~/.zshrc
source ~/.zshrc
```

## setup adb

```aiignore
echo 'export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools' >> ~/.zshrc
source ~/.zshrc

```

## open terminal cd to project root

```aiignore
brew install openjdk@17
```

```aiignore
npx expo prebuild
```

## for aab

```aiignore
eas build --local
```

## for apk

```aiignore
eas build --local --profile preview
```

## installing apk to device

!!!! start an emulator

locate the apk file and run

```aiignore
adb install build.apk
```