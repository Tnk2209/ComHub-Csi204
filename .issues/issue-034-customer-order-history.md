# Issue 034: Customer Order History Page

## What to build
Create a dedicated Customer Order History page (`OrderHistory.jsx`) that lists all orders placed by the currently logged-in customer, displaying the order ID, ordering date, cancellation/rejection date (if applicable), payment method, product list summary, total order price, and order status. It links directly to the detailed step-by-step order tracking timeline.

## Acceptance criteria
- [x] FrontEnd renders a dedicated customer order history page route at `/order-history`.
- [x] Displays a table/grid on desktop and responsive cards on mobile, listing all order numbers (`#OrderNo`), order date, and total order price formatted nicely.
- [x] Displays the cancellation/rejection date of an order if its status is cancelled (retrieved from `order_logs` audit logs containing cancellation/rejection markers).
- [x] Specifies the payment method as Bank Transfer (โอนเงินผ่านธนาคาร) for all slip-based order uploads.
- [x] Integrates action buttons linking to the step-by-step `/order-tracking` view of specific orders.
- [x] Integrates localized content strings for both Thai and English.
- [x] All 95 unit tests pass cleanly.
