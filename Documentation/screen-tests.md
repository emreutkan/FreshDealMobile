# Screen Test Descriptions

This document explains the intent of each test file under `__test__/screens`.

## AchievementsScreen.test.tsx
Verifies that the achievements screen dispatches the fetch thunk on mount, allows navigating back via the back button and renders the expected number of achievement cards for the mocked state.

## SearchScreen.test.tsx
Checks that typing into the search input updates the local state and that the amount of results rendered on screen reflects the search query.

## FavoritesScreen.test.tsx
Ensures the favourites screen shows a loading indicator when restaurant data is being fetched, displays an empty state message when there are no favourite restaurants and renders the favourites list when favourites exist.

## ChatbotScreen.test.tsx
Mimics starting a chatbot conversation and sending a message. It verifies that the initial bot reply is rendered and that sending a message results in an API call and shows the bot's response.

## RankingsScreen.test.tsx
Confirms that the leaderboard screen fetches rankings when mounted and reacts properly to loading, empty and populated state variations.

## CartScreen.test.tsx
Covers behaviours of the shopping cart screen. It checks that the cart thunk is dispatched on mount, that the empty cart state is shown when there are no items and that the checkout button appears when items are present.

## HomeScreen.test.tsx
Ensures the home screen routes to the address selection screen when the user has no saved addresses and shows the main home views once an address exists.

## OrdersScreen.test.tsx
Verifies the orders screen dispatches a fetch for active orders on mount and renders the empty state message when there are no active orders.

## PickUpDeliveryToggle.test.tsx
Tests the delivery method toggle component ensuring the correct buttons render depending on restaurant capabilities and that tapping them dispatches the expected action.

## userSlice.test.ts
Verifies basic reducers in the user slice including updating email/phone data, storing a token and clearing state on logout.

## restaurantSlice.test.ts
Checks core reducers of the restaurant slice such as updating the search radius and adjusting the pickup flag when a restaurant is selected.

## LandingScreen.test.tsx
Ensures the landing screen redirects to the home stack when a token already exists in redux state.

## AccountScreen.test.tsx
Checks that user achievements are fetched on mount by dispatching the appropriate thunk.

## DebugMenuScreen.test.tsx
Verifies that tapping the Redux inspection option reveals state sections and that API buttons dispatch their actions.

## FlashDealsBottomSheet.test.tsx
Tests that opening the flash deals bottom sheet triggers a fetch for available flash deals.

## CartIcon.test.tsx
Confirms that pressing the cart icon navigates to the Cart screen.

## addressSlice.test.ts
Covers basic reducers of the address slice including adding and removing addresses and updating the selected ID.
