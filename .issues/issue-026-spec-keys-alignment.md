# Issue 026: Specifications Keys Mismatch Alignment

## What to build

Align the specifications JSON keys between the FrontEnd admin product form and the BackEnd product schema validation.
FrontEnd forms currently send camelCase keys (like `formFactor`, `ramType`, `maxGpuLength`) which trigger BackEnd validation errors (400 Bad Request) because the backend expects snake_case keys (like `form_factor`, `ram_type`, `max_gpu_length_mm`). We also need to add a missing SSD form factor field and align the GPU length seed keys.

## Acceptance criteria

- [ ] FrontEnd Admin product forms submit specifications using snake_case keys (`form_factor`, `max_gpu_length_mm`, `ram_type`) instead of camelCase keys.
- [ ] FrontEnd Admin form for SSD includes a `form_factor` input field (e.g. M.2, SATA) to satisfy the BackEnd validation constraint.
- [ ] FrontEnd Mainboard form collects and submits `supported_ram` (as comma-separated string/array) to satisfy BackEnd validation.
- [ ] GPU length technical specification keys in database seed data (`length_mm`) and frontend rendering logic (`gpu_length_mm` vs `length_mm`) are aligned so that GPU length clearance checks correctly pull non-null values.
- [ ] Product CRUD (create and update) can be completed successfully via Admin UI without triggering specifications validation errors.

## Blocked by

None - can start immediately
