# FreshDealMobile

![FreshDeal Logo](src/assets/images/logo.png)

[![GitHub Issues](https://img.shields.io/github/issues/FreshDealApp/FreshDealMobile)](https://github.com/FreshDealApp/FreshDealMobile/issues)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)

## Overview

FreshDeal is an innovative mobile platform that tackles food waste by connecting businesses with surplus food to
consumers seeking affordable, high-quality meals. Our mission is to reduce food waste, provide budget-friendly meals,
and promote sustainability, aligning with the UN's Sustainable Development Goals.

The project is a robust cross-platform application developed using **React Native** and **Expo**.

## Technical Stack

![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator

### Installation

1. Clone the repository

```bash
git clone https://github.com/FreshDealApp/FreshDealMobile.git
cd FreshDealMobile
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm start
# or
yarn start
```

4. Run on specific platform

```bash
# For iOS
npm run ios
# For Android
npm run android
```

## 📱 Features and Functionalities

### Consumer Features

- **User Registration and Login**:
    - Create accounts using email or phone number.
    - Secure login options including passwordless methods.
- **Browse and Discover Deals**:
    - Search for food deals by location.
    - View detailed listings with ratings and reviews.
    - Filter by categories, price, and distance.
    - View restaurant details, including menus, hours, and ratings.
- **Order Management**:
    - Place orders directly through the app.
    - Order tracking and real-time updates.
    - Order history and reordering capability.
- **Feedback System**:
    - Rate businesses and provide detailed reviews.
    - AI-powered sentiment analysis of reviews.
    - Report issues with orders, ensuring quality control.
- **Notifications**:
    - Real-time alerts for new deals, order updates, and promotions.
    - Customizable notification preferences.
- **Favorites and Bookmarks**:
    - Save favorite restaurants and deals for quick access.
- **Gamification and Rewards**:
    - Earn points and achievements for sustainable actions.
    - Unlock badges and rewards for consistent engagement.
- **Chatbot Support**:
    - Get instant assistance with common questions and issues.

### Account Management

- View and update personal information
- Change passwords and security settings
- Manage payment methods
- Track sustainability impact
- View achievement progress

## 🏗️ Project Structure

```
src/
├── app.tsx                # Main application entry point
├── assets/                # Static assets (images, fonts)
├── features/              # Feature modules
│   ├── accountScreen/     # Account management
│   ├── CartScreen/        # Shopping cart
│   ├── CheckoutScreen/    # Checkout process
│   ├── homeScreen/        # Main dashboard
│   ├── RestaurantComments/# Restaurant reviews
│   └── ...
├── hooks/                 # Custom React hooks
├── middleware/            # Redux middleware
├── redux/                 # State management
│   ├── api/               # API interfaces
│   ├── slices/            # Redux slices
│   └── thunks/            # Async actions
├── services/              # External services integration
├── styles/                # Global styling
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🚢 Deployment

### Building for Production

1. For iOS:

```bash
npm run build:ios
# or
yarn build:ios
```

2. For Android:

```bash
npm run build:android
# or
yarn build:android
```

See [iOS Build Guide](Documentation/Guide/ios_build.md) and [Android Build Guide](Documentation/Guide/android_build.md)
for detailed instructions.

## 🌟 Project Achievements

- **Impactful Mission**: Reduces food waste, promotes sustainability, and supports local businesses.
- **Cross-Platform**: Available on Android, iOS, and web with optimized performance.
- **Gamification**: Rewards users for sustainable practices, encouraging regular engagement.
- **AI-Powered**: Uses machine learning for personalized recommendations and review analysis.
- **Scalable Architecture**: Built with modular, maintainable code structure.

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before
submitting pull requests. Make sure to also review our [Code of Conduct](CODE_OF_CONDUCT.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright (c) 2024 Irfan Emre Utkan

All Rights Reserved.

This software is made publicly available for educational and demonstrative purposes only.  
No permission is granted to copy, modify, distribute, or use any part of this software, including but not limited to
code, designs, or documentation.

The software is provided "as is," without warranty of any kind.

## 📬 Contact

Project Link: [https://github.com/FreshDealApp/FreshDealMobile](https://github.com/FreshDealApp/FreshDealMobile)

## 🙏 Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux](https://redux.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- All contributors who have helped shape and improve FreshDealMobile
