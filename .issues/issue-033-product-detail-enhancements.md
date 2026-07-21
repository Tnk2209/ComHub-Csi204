# Issue 033: Product Detail & Header Enhancements (PC Builder, Spec Grid, Cart Toast & Account Settings)

## What to build
Enhance the Product Detail page with PC Builder integration, human-readable specs, a bottom-right success toast on cart addition showing dynamic item counts, header wishlist/cart icon layouts with badges, and a unified settings dropdown profile component.

## Acceptance criteria
- [x] FrontEnd matches categories and enables adding products directly to the current PC Builder setup.
- [x] FrontEnd displays a real-time Compatibility status box in the Product Detail right column if the user has started a PC Build.
- [x] FrontEnd formats and localizes technical specification keys and list-based values into clean text elements.
- [x] FrontEnd displays a small toast notification in the bottom-right corner when adding an item to the cart, listing the product name, added quantity, and total items in the cart.
- [x] FrontEnd renders Wishlist and Cart icons with a dynamic red items counter badge next to the user profile avatar in the Header.
- [x] Standalone Preferences gear button is removed; system toggles (Language & Theme) are merged into the account dropdown (supporting both authenticated and guest preferences).
- [x] All unit tests compile and run successfully.
