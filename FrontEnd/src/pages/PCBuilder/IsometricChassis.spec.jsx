import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IsometricChassis from './IsometricChassis';

const emptyParts = {
  cpu: null, gpu: null, motherboard: null, ram: null, storage: null, case: null, psu: null,
};

describe('IsometricChassis — renders SVG with component slots', () => {
  it('renders the SVG element', () => {
    const { container } = render(<IsometricChassis selectedParts={emptyParts} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('highlights CPU area when cpu is selected', () => {
    const parts = { ...emptyParts, cpu: { id: 1, name: 'Ryzen 7', price: 299, tdp: 105 } };
    const { container } = render(<IsometricChassis selectedParts={parts} />);
    const cpuGroup = container.querySelector('[data-component="cpu"]');
    expect(cpuGroup).toBeInTheDocument();
    expect(cpuGroup.getAttribute('data-active')).toBe('true');
  });

  it('does not highlight CPU area when cpu is not selected', () => {
    const { container } = render(<IsometricChassis selectedParts={emptyParts} />);
    const cpuGroup = container.querySelector('[data-component="cpu"]');
    expect(cpuGroup).toBeInTheDocument();
    expect(cpuGroup.getAttribute('data-active')).toBe('false');
  });

  it('highlights all components that are selected', () => {
    const parts = {
      cpu: { id: 1, name: 'CPU', price: 100, tdp: 65 },
      gpu: { id: 2, name: 'GPU', price: 500, tdp: 200 },
      motherboard: null,
      ram: { id: 3, name: 'RAM', price: 80, tdp: 5 },
      storage: null,
      case: { id: 4, name: 'Case', price: 100, tdp: 0 },
      psu: { id: 5, name: 'PSU', price: 90, wattage: 650, tdp: 0 },
    };
    const { container } = render(<IsometricChassis selectedParts={parts} />);

    expect(container.querySelector('[data-component="cpu"][data-active="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="gpu"][data-active="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="ram"][data-active="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="case"][data-active="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="psu"][data-active="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="motherboard"][data-active="false"]')).toBeInTheDocument();
    expect(container.querySelector('[data-component="storage"][data-active="false"]')).toBeInTheDocument();
  });
});
