# Issue 032: Wishlist Stock Alert Clean-up

## What to build

Clean up the Wishlist Stock Alert button and logic to match the MVP scope.
The Stock Alert feature (including alert toggle bell icon and is_alert_enabled) was planned to be cut from the MVP version of ComHub. We need to remove these elements from the UI to prevent user confusion and clean up the codebase.

## Acceptance criteria

- [ ] FrontEnd `Wishlist.jsx` removes the "Enable Alert" or "Alert Enabled" bell button from product cards.
- [ ] FrontEnd removes any alert info cards or mentions related to Stock Alerts.
- [ ] Code is verified to render cleanly without errors or warnings.

## Blocked by

None - can start immediately
