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
7. **Offline-First Data Synchronization** - Premium feature allowing operations while offline with sync when online

## Key Files

- `/public/manifest.json` - Web app manifest with app metadata
- `/public/sw.js` - Service worker for offline functionality and caching
- `/public/icons/` - Directory containing app icons in various sizes
- `/app/offline/page.tsx` - Offline fallback page
- `/components/pwa/install-prompt.tsx` - Installation prompt component
- `/components/pwa/pwa-provider.tsx` - PWA functionality provider
- `/components/pwa/online-status.tsx` - Online/offline status utilities
- `/lib/sync/sync-service.ts` - Core offline sync functionality
- `/lib/sync/use-offline-sync.ts` - Hooks and utilities for offline sync
- `/components/sync/offline-sync-status.tsx` - UI component showing sync status
- `/components/admin/offline-sync-config.tsx` - Admin configuration for offline sync
- `/app/(pages)/admin/offline-sync/page.tsx` - Admin page for managing offline sync

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

### Offline-First Data Synchronization

Premium users can continue working with the application even when offline:

- Operations performed while offline are queued locally
- When the connection is restored, queued operations are automatically synchronized
- Clear visual indicators show users when they're working offline and what will happen when connectivity is restored
- Administrators can enable/disable this feature through a dedicated admin interface
- Only users with premium subscriptions have access to this functionality

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

### Using Offline-First Data Synchronization

```tsx
import { useSyncFetch } from "@/lib/sync/use-offline-sync";

function ExpenseForm() {
  const { execute, loading, error, isOffline, isPending } = useSyncFetch({
    endpoint: "/api/expenses",
    method: "POST",
  });

  const handleSubmit = async (formData) => {
    const result = await execute(formData);

    if (isOffline) {
      // Show message that the operation will be synced when online
      toast.info(
        "Your expense has been saved and will be synced when you're back online"
      );
    } else if (result) {
      // Operation was successful and performed online
      toast.success("Expense saved successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      {isPending && (
        <div className="text-amber-500 text-sm">
          You have pending operations that will sync when you're online
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
}
```

### Displaying Sync Status

```tsx
import OfflineSyncStatus from "@/components/sync/offline-sync-status";

function ExpensesPage() {
  return (
    <div>
      {/* Show sync status at the top of the page */}
      <OfflineSyncStatus />

      <h1>Expenses</h1>
      {/* Rest of the page content */}
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

### Admin Configuration

```tsx
import OfflineSyncConfig from "@/components/admin/offline-sync-config";

function AdminPage() {
  // Check if the current user is an admin
  const isAdmin = checkUserIsAdmin();

  return (
    <div>
      <h1>Admin Settings</h1>

      {/* Only render the config component if the user is an admin */}
      <OfflineSyncConfig isAdmin={isAdmin} />
    </div>
  );
}
```

## Testing PWA Features

To test the PWA features:

1. **Offline Mode**: Use Chrome DevTools > Network tab > "Offline" checkbox
2. **Installation**: Use Chrome DevTools > Application > Manifest
3. **Service Worker**: Use Chrome DevTools > Application > Service Workers
4. **Offline Sync**:
   - Enable offline sync in the admin panel
   - Switch to offline mode
   - Perform operations (create/update/delete)
   - Switch back to online mode and verify synchronization

## Production Considerations

Before deploying to production:

1. Create proper app icons for all sizes specified in the manifest
2. Test the offline functionality thoroughly
3. Ensure the service worker is properly caching critical assets
4. Test the installation process on various devices and browsers
5. Consider implementing push notifications for enhanced engagement
6. Implement proper error handling and conflict resolution for offline sync
7. Consider data size limitations for offline storage
8. Implement security measures to protect offline-stored data

## Resources

- [MDN Web Docs: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Web Fundamentals: Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web.dev: Progressive Web Apps](https://web.dev/progressive-web-apps/)
