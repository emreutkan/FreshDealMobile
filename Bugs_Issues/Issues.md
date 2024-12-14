[1]

- **issue:** After a build or when using expo go, app opens up to "Welcome to Expo" screen even though there are no
  issues with the code itself
- **why it happens:** index.tsx routes to loginpage with expo-router which is incompatible with react-native-dotenv on
  `Expo SDK 51`
- **Fix**:
    - Expo provides built-in support for .env files without the need for react-native-dotenv.
    - Step 1: Uninstall react-native-dotenv
        - ```npm uninstall react-native-dotenv ```
    - Step2: Update 'babel.config.js'
        - from:
            ```aiignore
            module.exports = function (api) {
                api.cache(true);
                return {
                    presets: ['babel-preset-expo'],
                    plugins: [
                        ['module:react-native-dotenv', {
                            moduleName: "@env",
                            path: ".env"
                            }]
                        ]
                    };
            };
        - to:
            ```aiignore
                module.exports = function (api) {
                    api.cache(true);
                    return {
                        presets: ['babel-preset-expo'],
                    };
                };
            -
    - Step3: Run the expo with --clear
        - ```npx expo start --clear ```
- **stackoverflow:** https://stackoverflow.com/questions/78494804/expo-stuck-on-welcome-to-expo-screen


