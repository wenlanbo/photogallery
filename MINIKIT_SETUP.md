# MiniKit Integration Guide

This guide explains how to use MiniKit with your photo gallery Mini App for enhanced Base App and Coinbase Wallet compatibility.

## What is MiniKit?

MiniKit is a React library that provides Coinbase Wallet-specific hooks and utilities for building Mini Apps. It simplifies the development process and provides better integration with Base App and Coinbase Wallet.

## Files Added

### 1. `frame-minikit.html`
A vanilla HTML/JS version that integrates MiniKit utilities via CDN. This maintains your current approach while adding MiniKit benefits.

### 2. `MiniKitApp.jsx`
A React component that uses MiniKit hooks for enhanced functionality. Use this if you want to migrate to React.

### 3. `package.json` (updated)
Added `@coinbase/minikit` dependency.

## Key MiniKit Features

### 1. **useIsInMiniApp()**
Detects if your app is running inside a Mini App environment:
```javascript
const isInMiniApp = useIsInMiniApp();
console.log(`Mini App environment: ${isInMiniApp}`);
```

### 2. **useMiniAppSDK()**
Provides access to the Mini App SDK with automatic fallbacks:
```javascript
const sdk = useMiniAppSDK();
await sdk.actions.ready(); // Dismiss splash screen
```

### 3. **Enhanced Compatibility**
MiniKit automatically handles:
- SDK loading across different platforms
- Fallback mechanisms for unsupported features
- Platform-specific optimizations

## Usage Options

### Option 1: Use `frame-minikit.html` (Recommended)
This is a drop-in replacement for your current `frame.html`:

1. **Deploy**: Replace your current `frame.html` with `frame-minikit.html`
2. **Test**: The app will work in Farcaster, Coinbase Wallet, and Base App
3. **No Changes**: Your existing API and image loading logic remains the same

### Option 2: Migrate to React with `MiniKitApp.jsx`
If you want to use React and MiniKit hooks:

1. **Install Dependencies**:
   ```bash
   npm install react react-dom @coinbase/minikit
   ```

2. **Use the Component**:
   ```jsx
   import MiniKitApp from './MiniKitApp';
   
   function App() {
     return <MiniKitApp />;
   }
   ```

3. **Benefits**:
   - Better state management
   - Cleaner code structure
   - Enhanced MiniKit integration

## MiniKit Advantages

### 1. **Better Platform Detection**
```javascript
// MiniKit provides reliable platform detection
const isInMiniApp = useIsInMiniApp();
const sdk = useMiniAppSDK();
```

### 2. **Automatic Fallbacks**
MiniKit automatically handles SDK loading failures and provides fallbacks for different platforms.

### 3. **Enhanced Error Handling**
Better error handling and logging for debugging Mini App issues.

### 4. **Future-Proof**
MiniKit is actively maintained and will support new Base App and Coinbase Wallet features.

## Testing

### Test in Different Environments:
1. **Farcaster**: Your app should work as before
2. **Coinbase Wallet**: Enhanced compatibility with CBW-specific features
3. **Base App**: Full compatibility with Base App Mini Apps
4. **Web Browser**: Graceful fallback to web mode

### Debug Logs:
MiniKit provides enhanced logging to help debug issues:
```
[MiniKit Mini App] 🚀 MiniKit Mini App loaded, initializing...
[MiniKit Mini App] 📍 Mini App environment: true
[MiniKit Mini App] ✅ MiniKit SDK loaded
[MiniKit Mini App] ✅ sdk.actions.ready() called successfully
```

## Migration Steps

### From Current `frame.html` to `frame-minikit.html`:

1. **Backup**: Keep your current `frame.html` as backup
2. **Replace**: Use `frame-minikit.html` as your main frame
3. **Test**: Verify functionality in all target platforms
4. **Deploy**: Update your deployment with the new file

### To React with MiniKit:

1. **Setup React**: Add React dependencies to your project
2. **Use Component**: Replace HTML with `MiniKitApp.jsx`
3. **Build**: Set up build process for React
4. **Deploy**: Deploy the React version

## Troubleshooting

### Common Issues:

1. **SDK Not Loading**: MiniKit provides multiple fallbacks
2. **Ready() Not Called**: MiniKit ensures proper ready() calls
3. **Platform Detection**: Use `useIsInMiniApp()` for reliable detection

### Debug Commands:
```javascript
// Check if in Mini App
console.log('Is in Mini App:', useIsInMiniApp());

// Check SDK availability
console.log('SDK available:', !!useMiniAppSDK());

// Test ready() call
const sdk = useMiniAppSDK();
await sdk.actions.ready();
```

## Next Steps

1. **Test**: Try both `frame-minikit.html` and `MiniKitApp.jsx`
2. **Choose**: Decide which approach fits your needs
3. **Deploy**: Update your production environment
4. **Monitor**: Watch for any issues in different platforms

MiniKit provides a more robust foundation for your Mini App while maintaining compatibility with all target platforms. 