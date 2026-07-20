# Issue 028: PC Builder PSU Filtering & Recommendation

## What to build

Implement safety margin filtering and recommendation in the PC Builder PSU category.
When selecting a PSU in the PC Builder Workspace, the UI category modal should recommend/filter the power supply units to display those that have a wattage rating exceeding `totalTdp * 1.2` (providing a 20% safety overhead margin).

## Acceptance criteria

- [ ] PSU selection modal filters or explicitly highlights/recommends PSUs satisfying the safety overhead margin: `psu.wattage >= totalTdp * 1.2`.
- [ ] If no PSUs meet this margin, or if the user overrides it, a warning or helpful hint is shown on the UI.
- [ ] The TDP progress bar or summary section guides the user on the recommended minimum wattage.

## Blocked by

- [issue-026-spec-keys-alignment.md](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-026-spec-keys-alignment.md)
