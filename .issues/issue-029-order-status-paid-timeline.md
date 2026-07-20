# Issue 029: Order Status Paid Step in Timeline

## What to build

Integrate the "Paid" order status into the tracking flow on both FrontEnd and BackEnd.
The order tracking flow currently skips the `paid` status, moving directly from `pending_payment` to `processing` when an admin approves the payment. We need to introduce the `paid` status stage as a distinct step on the user's tracking timeline, resulting in a 5-step timeline as specified (`Pending Payment` -> `Paid` -> `Processing` -> `Shipped` -> `Delivered`).

## Acceptance criteria

- [ ] BackEnd `approvePayment` endpoint sets the order's `order_status` to `paid` upon slip approval (instead of straight to `processing`).
- [ ] BackEnd supports transition from `paid` to `processing` in `updateOrderStatus`.
- [ ] FrontEnd `timelineSteps` in `OrderTracking.jsx` includes `paid` as the 2nd stage in the progress bar.
- [ ] Timeline rendering shows correct status logs when transition to `paid` occurs.

## Blocked by

None - can start immediately
