import 'dotenv/config';

export default {
    expo: {
        name: "FreshDeal",
        slug: "freshdeal-siarqbmuhjlnnxqkbsqk",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./src/assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
            bundleIdentifier: "com.emreutkan.freshdeal"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.emreutkan.freshdeal",
            googleServicesFile: "./google-services.json",
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY,
                },
            },
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./src/assets/images/favicon.png"
        },
        plugins: [
            "expo-font",
            "expo-secure-store",
            [
                "expo-notifications",
                {
                    icon: "./src/assets/images/adaptive-icon.png",
                    color: "#50703C",
                    sounds: ["./src/assets/notification.wav"],
                    mode: "production"
                }
            ]
        ],
        notification: {
            icon: "./src/assets/images/adaptive-icon.png",
            color: "#50703C",
            iosDisplayInForeground: true,
            androidMode: "default",
            androidCollapsedTitle: "Fresh Deal"
        },
        experiments: {
            typedRoutes: true
        },
        extra: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            eas: {
                projectId: "841595e4-78a3-42c1-8da1-938b6a83b1b6"
            }
        }
    }
};