# Issue 031: Admin Add Account Form/Modal

## What to build

Add an account creation mechanism for administrators.
The administrator account manager screen should have an "Add Admin" button that opens a form/modal to directly create new Admin accounts, avoiding the need to register them as Customers first and then manually promote them.

## Acceptance criteria

- [ ] FrontEnd `AdminAccounts.jsx` renders an "Add Admin" button.
- [ ] Clicking "Add Admin" opens a modal/form requesting account fields: Email, Password, First Name, Last Name.
- [ ] Submitting the form calls a POST endpoint on the BackEnd to create the Admin user.
- [ ] BackEnd secures this endpoint with admin check middleware (`requireRole('Admin')`), inserting the user into database with `role = 'Admin'`.

## Blocked by

None - can start immediately
