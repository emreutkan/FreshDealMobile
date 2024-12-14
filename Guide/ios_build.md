you need a mac for this

check xcode version

```aiignore
xcodebuild -version
```

## install CocoaPods

```aiignore
sudo gem install cocoapods
```

## build for device (xcode Sideload)

### install xcode command line tools

```aiignore
xcode-select --install
```

### enable developer mode in your iphone

### prepare project

```aiignore
npx expo prebuild
```

this will create the ios directory

### open project in xcode

navigate to ios directory of this project

## building without apple account

modify eas.json if not modified already

```aiignore
{
  "build": {
    "ios-local": {
      "workflow": "generic",
      "distribution": "simulator"
    }
  }
}

```