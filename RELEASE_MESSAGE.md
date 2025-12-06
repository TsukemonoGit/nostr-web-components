# Release v0.3.0

## 🎉 TypeScript Support & Code Quality Improvements

### ✨ New Features

- **TypeScript Type Definitions**: Automatic generation of `.d.ts` files during build
- **Type Exports**: Proper TypeScript type exports via package.json
- **Utility Functions**: New `parseRelays()` and `getThemeClass()` functions for better code reuse

### 🔧 Improvements

- **Major Refactoring**: 
  - Removed duplicate code across components
  - Unified code style and comments
  - Consolidated relay parsing and theme calculation logic
- **Build Process**: Improved build script to preserve type definitions
- **Code Quality**: Cleaned up commented-out code and improved maintainability

### 🐛 Bug Fixes

- Fixed type definition files being deleted during build process

### 📦 Installation

```bash
npm install @konemono/nostr-web-components@0.3.0
```

### 🔄 Migration

No breaking changes! This release is fully backward-compatible.

### 📚 Documentation

- See [CHANGELOG.md](./CHANGELOG.md) for detailed changes
- See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for migration guide and technical details

---

**Full Changelog**: https://github.com/TsukemonoGit/nostr-web-components/compare/v0.2.10...v0.3.0

