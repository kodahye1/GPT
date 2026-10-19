export interface Model {
  id: string;
  name: string;
  publisher: string;
  sizeGB: number;
  isNew?: boolean;
  featured?: boolean;
  category?: string;
}

export interface Target {
  id: string;
  ip: string;
  totalGB: number;
  usedGB: number;
  online: boolean;
  installed: string[];
}

export interface InstallJob {
  targetId: string;
  modelId: string;
  startedAt: number;
  durationMs: number;
  progress: number;
}

export interface InstallState { targets: Target[]; jobs: InstallJob[] }

export type Action =
  | { type: 'start'; model: Model; targetIds: string[]; now: number }
  | { type: 'tick'; now: number; models: Model[] }
  | { type: 'remove'; model: Model; targetIds: string[] }
  | { type: 'cancel'; targetIds: string[] }
  | { type: 'save-target'; target: Target }
  | { type: 'reset'; targets: Target[] };

const round = (n: number) => Math.round(n * 1000) / 1000;
export const freeGB = (target: Target) => round(Math.max(0, target.totalGB - target.usedGB));
export function canInstall(state: InstallState, model: Model, target: Target) {
  return target.online && !target.installed.includes(model.id)
    && !state.jobs.some(job => job.targetId === target.id)
    && freeGB(target) >= model.sizeGB;
}

export function installReducer(state: InstallState, action: Action): InstallState {
  switch (action.type) {
    case 'start': {
      const jobs = state.targets.filter(t => action.targetIds.includes(t.id) && canInstall(state, action.model, t))
        .map((target, i) => ({ targetId: target.id, modelId: action.model.id,
          startedAt: action.now, durationMs: 7600 + i * 1100, progress: 0 }));
      return jobs.length ? { ...state, jobs: [...state.jobs, ...jobs] } : state;
    }
    case 'tick': {
      if (!state.jobs.length) return state;
      let targets = state.targets;
      const remaining: InstallJob[] = [];
      for (const job of state.jobs) {
        const progress = Math.min(100, Math.max(0, (action.now - job.startedAt) / job.durationMs * 100));
        if (progress < 100) { remaining.push({ ...job, progress }); continue; }
        const model = action.models.find(m => m.id === job.modelId);
        if (!model) continue;
        targets = targets.map(t => t.id === job.targetId && !t.installed.includes(model.id)
          ? { ...t, usedGB: round(t.usedGB + model.sizeGB), installed: [...t.installed, model.id] } : t);
      }
      return { targets, jobs: remaining };
    }
    case 'remove':
      return { ...state, targets: state.targets.map(t => action.targetIds.includes(t.id) && t.installed.includes(action.model.id)
        ? { ...t, usedGB: round(Math.max(0, t.usedGB - action.model.sizeGB)), installed: t.installed.filter(id => id !== action.model.id) } : t) };
    case 'cancel': return { ...state, jobs: state.jobs.filter(j => !action.targetIds.includes(j.targetId)) };
    case 'save-target': return { ...state, targets: state.targets.some(t => t.id === action.target.id)
      ? state.targets.map(t => t.id === action.target.id ? action.target : t) : [...state.targets, action.target] };
    case 'reset': return { targets: structuredClone(action.targets), jobs: [] };
  }
}

export function validIPv4(value: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value)
    && value.split('.').every(part => Number(part) <= 255 && (part === '0' || !part.startsWith('0')));
}

export function readSavedTargets(raw: string | null, fallback: Target[], modelIds: string[]): Target[] {
  try {
    if (!raw) return structuredClone(fallback);
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.targets) || !saved.targets.length) throw new Error('Invalid saved data');
    const ids = new Set<string>(); const ips = new Set<string>();
    for (const t of saved.targets) {
      if (!t || typeof t.id !== 'string' || !t.id || ids.has(t.id) || ips.has(t.ip)
        || typeof t.ip !== 'string' || !validIPv4(t.ip) || typeof t.online !== 'boolean'
        || !Number.isFinite(t.totalGB) || !Number.isFinite(t.usedGB) || t.totalGB <= 0
        || t.usedGB < 0 || t.usedGB > t.totalGB || !Array.isArray(t.installed)
        || !t.installed.every((id: unknown) => typeof id === 'string' && modelIds.includes(id))
        || new Set(t.installed).size !== t.installed.length) throw new Error('Invalid target');
      ids.add(t.id); ips.add(t.ip);
    }
    return saved.targets;
  } catch { return structuredClone(fallback); }
}
