# Release Notes - v0.3.0

## 🎉 What's New

### TypeScript Support Improvements

This release adds comprehensive TypeScript support with automatic type definition generation. Type definitions are now included in the package and properly exported, making it easier to use this library in TypeScript projects.

**What this means for you:**
- Full TypeScript IntelliSense support
- Type checking for all exported components and utilities
- Better developer experience with autocomplete and type hints

### Code Quality Improvements

We've performed a major refactoring to improve code maintainability and reduce duplication:

- **Removed duplicate code**: Consolidated relay parsing and theme class calculation into reusable utility functions
- **Cleaned up codebase**: Removed commented-out debug code and unified comment styles
- **Better organization**: Improved code structure and consistency across all components

### Build Process Updates

The build process has been updated to:
- Automatically generate TypeScript type definitions
- Preserve type definitions after build completion
- Properly export types in package.json

## 📦 Installation

```bash
npm install @konemono/nostr-web-components@0.3.0
```

## 🔄 Migration Guide

No breaking changes! This is a backward-compatible release. You can upgrade without any code changes.

### For TypeScript Users

If you're using TypeScript, you'll now get full type support automatically:

```typescript
import { NostrContainer, NostrNote, type NostrClientConfig } from '@konemono/nostr-web-components';

// Full type checking and IntelliSense support
const config: NostrClientConfig = {
  relays: ['wss://relay.example.com'],
  timeout: 5000
};
```

## 🐛 Bug Fixes

- Fixed issue where type definition files were being deleted during build process

## 📝 Technical Details

### New Utility Functions

- `parseRelays(relays: string[] | string | undefined): string[]` - Parse relays prop from string or array
- `getThemeClass(theme: 'light' | 'dark' | 'auto'): string` - Get theme class based on theme prop

These functions are now used internally by all components, reducing code duplication.

## 🙏 Thanks

Thank you for using Nostr Web Components! If you encounter any issues or have suggestions, please open an issue on GitHub.

