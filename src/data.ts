import type { Model, Target } from './installation';

export const models: Model[] = [
  { id: 'minimax-h3', name: 'MiniMax H3', publisher: 'MiniMax', sizeGB: 42.8, isNew: true, featured: true, category: 'AI Video' },
  { id: 'hunyuan-15', name: 'HunyuanVideo 1.5', publisher: 'Tencent', sizeGB: 64.6, isNew: true, featured: true, category: 'AI Video' },
  { id: 'wan-22', name: 'Wan 2.2', publisher: 'Alibaba', sizeGB: 32.4, isNew: true, featured: true, category: 'AI Video' },
  { id: 'ltx-25', name: 'LTX-2.5', publisher: 'Lightricks', sizeGB: 94.2, isNew: true, featured: true, category: 'AI Video' },
  { id: 'ltx-23', name: 'LTX-2.3', publisher: 'Lightricks', sizeGB: 48.6, category: 'AI Video' },
  { id: 'ltx-23-fast', name: 'LTX-2.3 Fast', publisher: 'Lightricks', sizeGB: 19.6, category: 'AI Video' },
  { id: 'fast-h3', name: 'Fast H3', publisher: 'Convert text prompts to images', sizeGB: 21.4, category: 'AI Video' },
  { id: 'kandinsky', name: 'Kandinsky 5.0', publisher: 'Convert text prompts to images', sizeGB: 18.8, category: 'Text to Image' },
  { id: 'cogvideo', name: 'CogVideoX-5B', publisher: 'Convert text prompts to images', sizeGB: 12.4, category: 'AI Video' },
  { id: 'longcat', name: 'LongCat Avatar', publisher: 'Convert text prompts to images', sizeGB: 8.4, category: 'Motion' },
  { id: 'mova', name: 'MOVA', publisher: 'Convert text prompts to images', sizeGB: 24.8, category: '3D Model' },
];
// Keep the full catalog for saved installations; only the visible list follows the latest Figma.
export const modelList = ['minimax-h3', 'wan-22', 'ltx-25', 'ltx-23', 'ltx-23-fast', 'fast-h3', 'longcat', 'mova']
  .map(id => models.find(model => model.id === id)!);
export const extraModels: Model[] = [
  { id: 'qwen-edit', name: 'Qwen Image Edit', publisher: 'Qwen', sizeGB: 20.4, category: 'Image Editor' },
  { id: 'swift-vr', name: 'Swift VR', publisher: 'Swift', sizeGB: 12.7, category: 'World Generation' },
];
export const allModels = [...models, ...extraModels];
export const initialTargets: Target[] = [
  { id: 'target-110', ip: '192.168.1.110', totalGB: 436.2, usedGB: 326.5, online: true,
    installed: ['ltx-25', 'ltx-23', 'ltx-23-fast', 'kandinsky', 'cogvideo'] },
  { id: 'target-105', ip: '192.168.1.105', totalGB: 436.2, usedGB: 326.5, online: true,
    installed: ['qwen-edit', 'wan-22', 'longcat', 'swift-vr', 'ltx-23-fast', 'cogvideo'] },
];
export const categories = ['Text to Image', 'Image Editor', 'Upscale', '3D Model', 'AI Video', 'Audio', 'Motion', 'World Generation', 'VLM'];
