# Test Overview

This document summarizes the purpose and coverage of the unit tests found in the `__test__` folder.

## Components

- **BaseInput.test.tsx** – verifies that text changes trigger the provided callback and that the clear button resets the field.
- **CustomButton.test.tsx** – ensures buttons trigger the `onPress` handler and correctly display a loader while `loading` is true.
- **ForgotPasswordModal.test.tsx** – checks that cancel and submit actions invoke their callbacks.
- **GoBack.test.tsx** – confirms that pressing the component invokes navigation's `goBack`.
- **PhoneInput.test.tsx** – validates sanitisation of phone input and confirms that country code selection is dispatched.

## Screens

- **SearchScreen.test.tsx** – verifies that typing into the search input updates results displayed on the screen.
- **AchievementsScreen.test.tsx** – ensures the achievement fetch thunk is dispatched, the back button navigates away, and the correct number of cards render.

## Middleware

- **restaurantMiddleware.test.ts** – checks that selecting a restaurant dispatches a listings thunk.
- **tokenMiddleware.test.ts** – verifies logout is dispatched when no token exists while allowing normal actions when a token is present.

## Services

- **tokenService.test.ts** – tests `validateToken` for returning tokens and throwing errors on missing values.

## Utilities

- **ResponsiveFont.test.ts** – validates font scaling behaviour across device widths.
- **RestaurantFilters.test.ts** – verifies distance calculations and open/close logic for restaurants.
- **logger.test.ts** – ensures log helpers output expected console statements.

## API

- **pushNotifications.test.ts** – confirms the push notification API sends a cleaned push token to the backend.

These tests collectively exercise important branches of logic across middleware, utilities and user interface components, helping guard core functionality.
