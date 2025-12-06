# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-12-19

### Added
- **TypeScript type definitions**: Type definition files (`.d.ts`) are now automatically generated during build
- **Type exports**: Package now properly exports TypeScript types via `package.json` exports field
- **Utility functions**: Added `parseRelays()` and `getThemeClass()` utility functions for code reuse

### Changed
- **Refactoring**: Major code refactoring to improve maintainability
  - Removed duplicate type definitions
  - Unified comment style across all files
  - Removed commented-out debug code
  - Consolidated duplicate code into reusable utility functions
- **Build process**: Build script now generates type definitions after Vite build completes
- **Component improvements**: All components now use shared utility functions for relay parsing and theme class calculation

### Fixed
- Type definitions are now properly preserved after build (previously they were deleted during Vite's cleanup phase)

## [0.2.10] - Previous version

Previous features and bug fixes.

