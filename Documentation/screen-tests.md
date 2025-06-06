# Screen Test Descriptions

This document explains the intent of each test file under `__test__/screens`.

## AchievementsScreen.test.tsx
Verifies that the achievements screen dispatches the fetch thunk on mount, allows navigating back via the back button and renders the expected number of achievement cards for the mocked state.

## SearchScreen.test.tsx
Checks that typing into the search input updates the local state and that the amount of results rendered on screen reflects the search query.

## FavoritesScreen.test.tsx
Ensures the favourites screen shows a loading indicator when restaurant data is being fetched, displays an empty state message when there are no favourite restaurants and renders the favourites list when favourites exist.

## ChatbotScreen.test.tsx
Mimics starting a chatbot conversation and sending a message. It verifies that the initial bot reply is rendered and that sending a message results in an API call and shows the bot\'s response.
