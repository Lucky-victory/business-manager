# PWA Implementation for Biz Manager

This document outlines the Progressive Web App (PWA) implementation for Biz Manager, explaining the key components, features, and how to use them.

## Overview

The Biz Manager PWA implementation includes:

1. **Service Worker** - For offline functionality and caching
2. **Web Manifest** - For app metadata and installation
3. **Installation Prompt** - Custom dialog to encourage app installation
4. **Offline Page** - Dedicated page shown when the user is offline
5. **Online/Offline Status Components** - Utilities for conditional rendering based on connectivity
6. **Offline Styling** - Visual indicators for offline mode

## Key Files

- `/public/manifest.json` - Web app manifest with app metadata
- `/public/sw.js` - Service worker for offline functionality and caching
- `/public/icons/` - Directory containing app icons in various sizes
- `/app/offline/page.tsx` - Offline fallback page
- `/components/pwa/install-prompt.tsx` - Installation prompt component
- `/components/pwa/pwa-provider.tsx` - PWA functionality provider
- `/components/pwa/online-status.tsx` - Online/offline status utilities

## Features

### Offline Support

The service worker implements a caching strategy that allows the app to work offline:

- HTML pages use a network-first strategy with offline fallback
- Static assets use a cache-first strategy with network fallback
- Failed image requests in offline mode show a placeholder image

### Installation Prompt

A custom installation prompt is shown to users who:

- Haven't installed the app yet
- Haven't dismissed the prompt recently
- Are using a browser that supports PWA installation

The prompt explains the benefits of installing the app and provides a simple way to do so.

### Online/Offline Status

The app provides visual indicators when the user is offline:

- An orange banner appears at the top of the screen
- Certain elements can be hidden or shown based on connectivity
- The `OnlineOnly` and `OfflineOnly` components can be used for conditional rendering

## Usage Examples

### Conditional Rendering Based on Connectivity

```tsx
import { OnlineOnly, OfflineOnly } from "@/components/pwa/online-status";

function MyComponent() {
  return (
    <div>
      <OnlineOnly>
        <p>This content is only visible when online</p>
      </OnlineOnly>

      <OfflineOnly>
        <p>This content is only visible when offline</p>
      </OfflineOnly>

      <OnlineOnly fallback={<p>You're offline, please reconnect</p>}>
        <p>This content is replaced with a fallback when offline</p>
      </OnlineOnly>
    </div>
  );
}
```

### CSS Classes for Offline Styling

```css
/* Hide element when offline */
.offline-hidden {
  /* This element will be hidden when offline */
}

/* Show element only when offline */
.offline-visible {
  display: none;
}
body.offline .offline-visible {
  display: block;
}
```

## Testing PWA Features

To test the PWA features:

1. **Offline Mode**: Use Chrome DevTools > Network tab > "Offline" checkbox
2. **Installation**: Use Chrome DevTools > Application > Manifest
3. **Service Worker**: Use Chrome DevTools > Application > Service Workers

## Production Considerations

Before deploying to production:

1. Create proper app icons for all sizes specified in the manifest
2. Test the offline functionality thoroughly
3. Ensure the service worker is properly caching critical assets
4. Test the installation process on various devices and browsers
5. Consider implementing push notifications for enhanced engagement

## Resources

- [MDN Web Docs: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Web Fundamentals: Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web.dev: Progressive Web Apps](https://web.dev/progressive-web-apps/)
