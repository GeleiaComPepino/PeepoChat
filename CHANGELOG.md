# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.2] - 2025-12-27

### Added

-   Channel management system with persistent storage
-   Add Channel modal for searching and adding Twitch channels via API
-   Channel removal functionality in channel dropdown menu
-   Channel pin/unpin functionality to keep favorite channels at the top
-   Dynamic channel list rendering from store in sidebar with pinned channels sorted first
-   Environment variables configuration for Twitch API credentials

### Changed

-   Channel navigation now forces full page reload for proper state reset
-   Twitch API credentials moved from hardcoded values to environment variables (NUXT_TWITCH_APP_CLIENT_ID, NUXT_TWITCH_APP_CLIENT_SECRET)

## [0.0.1] - 2024-04-08

### Added

-   index route; "No Channel Selected" view.
-   mentions route; "No Mentions" view.
-   `/channel/twitch/<channel name>` route.
-   collapsible sidebar.
-   nuxt ui theme standards.
-   dark mode theme toggle.
-   pinia storage.
-   i18n translation.
-   catch-all route to index view.
