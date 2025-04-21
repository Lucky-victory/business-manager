# PWA Icons for Biz Manager

This directory contains the icons needed for the Progressive Web App (PWA) functionality of Biz Manager.

## Required Icons

The following icons are referenced in the manifest.json and service worker:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- offline-image.png (used when images fail to load in offline mode)
- splash-screen.png (used as the startup image for iOS devices)

## Icon Creation Guidelines

For a production environment, you should create proper icons with the following specifications:

1. All icons should use the brand color (#4f46e5) as the background
2. Use the "BM" text or the Biz Manager logo as the foreground in white
3. Make sure the icons are properly sized according to their dimensions
4. The offline-image.png should be a simple image indicating content is unavailable
5. The splash-screen.png should be a full-screen image (1242x2688px recommended for modern iPhones) with the logo centered

## Placeholder Icons

For development purposes, you can create simple placeholder icons using online tools like:

- https://app-manifest.firebaseapp.com/
- https://maskable.app/
- https://www.pwabuilder.com/

Or use image editing software like GIMP, Photoshop, or Figma to create the icons according to the specifications.
