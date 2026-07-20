const STORAGE_KEY = 'comhub_builder';

const EMPTY_PARTS = {
  cpu: null,
  gpu: null,
  motherboard: null,
  ram: null,
  storage: null,
  case: null,
  psu: null,
};

export function loadBuilderState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PARTS };
    return { ...EMPTY_PARTS, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_PARTS };
  }
}

export function saveBuilderState(parts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
  } catch {
    // silently fail (quota exceeded, private browsing)
  }
}

export function clearBuilderState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
