# Issue 027: CPU RAM Type Compatibility Check Logic

## What to build

Enhance the PC Builder compatibility engine to check if the RAM type matches what the CPU supports.
Currently, the frontend compatibility checker only verifies that the Motherboard RAM type matches the selected RAM module's type. It does not check if the CPU's memory controller supports the selected RAM type (`CPU.specifications.supported_ram` array must contain `RAM.specifications.ram_type`).

## Acceptance criteria

- [ ] PC Builder compatibility engine checks if the selected RAM type is supported by the selected CPU.
- [ ] If CPU and RAM are both selected and the RAM type is not in the CPU's `supported_ram` list, the RAM Type compatibility status is set to `error` with a clear warning message.
- [ ] FrontEnd unit test suite covers this validation case in `buildCompatibility.spec.js`.

## Blocked by

- [issue-026-spec-keys-alignment.md](file:///c:/Users/thana/Desktop/Work%20Main/ComHub-Csi204/.issues/issue-026-spec-keys-alignment.md)
