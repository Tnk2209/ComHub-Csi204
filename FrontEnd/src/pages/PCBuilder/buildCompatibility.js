/**
 * Pure function that computes compatibility checks for a PC build.
 * Extracted from PCBuilder component for testability.
 */
export function buildCompatibility(selectedParts) {
  const checks = {
    socket: { status: 'idle', message: 'socket_idle' },
    power: { status: 'idle', message: 'power_idle' },
    clearance: { status: 'idle', message: 'clearance_idle' },
    ramType: { status: 'idle', message: 'ram_type_idle' },
    formFactor: { status: 'idle', message: 'form_factor_idle' },
  };

  const cpu = selectedParts.cpu;
  const mb = selectedParts.motherboard;
  const gpu = selectedParts.gpu;
  const computerCase = selectedParts.case;
  const psu = selectedParts.psu;
  const ram = selectedParts.ram;

  // 1. Socket Check
  if (cpu && mb) {
    if (cpu.socket === mb.socket) {
      checks.socket = { status: 'success', message: 'socket_match', params: { cpuSocket: cpu.socket } };
    } else {
      checks.socket = { status: 'error', message: 'socket_mismatch', params: { cpuSocket: cpu.socket, mbSocket: mb.socket } };
    }
  }

  // 2. Power Analysis
  let totalTdp = 0;
  if (cpu) totalTdp += cpu.tdp;
  if (gpu) totalTdp += gpu.tdp;
  if (mb) totalTdp += mb.tdp;
  if (ram) totalTdp += ram.tdp || 10;
  if (selectedParts.storage) totalTdp += selectedParts.storage.tdp || 10;
  totalTdp += 30;

  if (psu) {
    const loadPercentage = (totalTdp / psu.wattage) * 100;
    if (totalTdp > psu.wattage) {
      checks.power = { status: 'error', message: 'power_overload', params: { totalTdp, psuWattage: psu.wattage } };
    } else if (loadPercentage > 80) {
      checks.power = { status: 'warning', message: 'power_warning', params: { loadPercentage: Math.round(loadPercentage) } };
    } else {
      checks.power = { status: 'success', message: 'power_match', params: { totalTdp, psuWattage: psu.wattage, loadPercentage: Math.round(loadPercentage) } };
    }
  } else {
    if (totalTdp > 30) {
      checks.power = { status: 'warning', message: 'power_need_psu', params: { totalTdp, recommendedWattage: Math.ceil((totalTdp * 1.25) / 50) * 50 } };
    }
  }

  // 3. Physical Clearance
  if (gpu && computerCase) {
    if (gpu.length > computerCase.maxGpuLength) {
      checks.clearance = { status: 'error', message: 'clearance_mismatch', params: { gpuLength: gpu.length, caseLimit: computerCase.maxGpuLength } };
    } else {
      checks.clearance = { status: 'success', message: 'clearance_match', params: { gpuLength: gpu.length, caseLimit: computerCase.maxGpuLength } };
    }
  }

  // 4. RAM Type Check
  let ramTypeStatus = 'idle';
  let ramTypeMessage = 'ram_type_idle';
  let ramTypeParams = {};

  if (ram && ram.ramType) {
    const selectedRamType = ram.ramType;
    let mbCompatible = true;
    let cpuCompatible = true;

    if (mb && mb.ramType && selectedRamType) {
      if (mb.ramType !== selectedRamType) {
        mbCompatible = false;
      }
    }

    if (cpu && cpu.ramType && selectedRamType) {
      const supported = Array.isArray(cpu.ramType)
        ? cpu.ramType
        : typeof cpu.ramType === 'string'
          ? cpu.ramType.split(',').map((s) => s.trim())
          : [];
      if (supported.length > 0 && !supported.includes(selectedRamType)) {
        cpuCompatible = false;
      }
    }

    if (!mbCompatible) {
      ramTypeStatus = 'error';
      ramTypeMessage = 'ram_type_mismatch';
      ramTypeParams = { mbRamType: mb.ramType, ramType: selectedRamType };
    } else if (!cpuCompatible) {
      ramTypeStatus = 'error';
      ramTypeMessage = 'cpu_ram_type_mismatch';
      const cpuSupported = Array.isArray(cpu.ramType)
        ? cpu.ramType.join(', ')
        : cpu.ramType;
      ramTypeParams = { cpuSupported, ramType: selectedRamType, cpuName: cpu.name };
    } else if (mb || cpu) {
      ramTypeStatus = 'success';
      ramTypeMessage = 'ram_type_match';
      ramTypeParams = { ramType: selectedRamType };
    }
  }

  checks.ramType = { status: ramTypeStatus, message: ramTypeMessage, params: ramTypeParams };

  // 5. Form Factor Check
  if (mb && computerCase && mb.formFactor && computerCase.formFactor) {
    const supported = Array.isArray(computerCase.formFactor) ? computerCase.formFactor : [computerCase.formFactor];
    if (supported.includes(mb.formFactor)) {
      checks.formFactor = { status: 'success', message: 'form_factor_match', params: { mbFormFactor: mb.formFactor } };
    } else {
      checks.formFactor = { status: 'error', message: 'form_factor_mismatch', params: { mbFormFactor: mb.formFactor, caseFormFactors: supported.join(', ') } };
    }
  }

  const totalCost = Object.values(selectedParts).reduce((sum, item) => sum + (item ? item.price : 0), 0);

  return { checks, totalTdp, totalCost };
}
