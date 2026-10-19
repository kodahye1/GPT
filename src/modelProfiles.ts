export interface ModelDetails {
  name: string;
  description: string;
  features: string[];
  recommendedFor: string;
  repository: string;
  documentation?: string;
  releasedOn: string;
  primary: { src: string; alt: string };
  secondary: { src: string; alt: string };
}

const ltxMedia = {
  primary: { src: '/assets/models/ltx-primary.webp', alt: 'Animated characters around a campfire, from the official LTX-2 family video demo' },
  secondary: { src: '/assets/models/ltx-secondary.webp', alt: 'A second frame from the official LTX-2 family video demo' },
};

// Descriptions summarize the official repositories; recommendations are based on their documented capabilities.
// Asset URLs, video frame timestamps, and checksums are recorded in public/assets/models/SOURCES.json.
export const modelDetails: Record<string, ModelDetails> = {
  'minimax-h3': {
    name: 'MiniMax H3',
    description: 'Unified multimodal video generation with native stereo audio and flexible text, image, video, and audio references.',
    features: ['Multimodal references', 'Native stereo audio', '24 FPS video', '4–15 second clips', 'First / last frame control'],
    recommendedFor: 'Creators developing short audiovisual scenes from mixed reference material, teams exploring sound and motion together, and filmmakers who need control over the opening and closing frames.',
    repository: 'https://github.com/MiniMax-AI/MiniMax-H3',
    releasedOn: '2026. 07. 31',
    primary: { src: '/assets/models/minimax-primary.webp', alt: 'Spacecraft scene from the official MiniMax H3 text-to-video-and-audio demo' },
    secondary: { src: '/assets/models/minimax-secondary.webp', alt: 'Outdoor scene from the official MiniMax H3 reference-to-video-and-audio demo' },
  },
  'hunyuan-15': {
    name: 'HunyuanVideo 1.5',
    description: 'An efficient 8.3B-parameter video model for text-to-video and image-to-video generation, with consumer GPU support.',
    features: ['8.3B parameters', 'Text / image to video', '720p / 1080p', 'Step distillation', 'LoRA training'],
    recommendedFor: 'Video creators turning prompts or reference images into short clips, developers experimenting on consumer hardware, and teams adapting a video model to a particular subject or visual style.',
    repository: 'https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5',
    releasedOn: '2025. 11. 20',
    primary: { src: '/assets/models/hunyuan-primary.png', alt: 'Reading by a cottage window, an image-to-video input example from HunyuanVideo 1.5' },
    secondary: { src: '/assets/models/hunyuan-secondary.png', alt: 'Woman with a parrot, an image-to-video input example from HunyuanVideo 1.5' },
  },
  'fast-h3': {
    name: 'Fast H3',
    description: 'FastVideo’s sparse-distilled MiniMax H3 checkpoint family for synchronized video and audio generation in fewer sampling steps.',
    features: ['DMD2 distillation', '4 / 8-step variants', 'Sparse attention', 'Synchronized audio', 'Local inference'],
    recommendedFor: 'Creators iterating on audiovisual scenes, developers exploring distilled video generation, and teams using the FastVideo inference recipes for shorter sampling schedules.',
    repository: 'https://github.com/hao-ai-lab/FastVideo',
    releasedOn: '2026. 08. 27',
    primary: { src: '/assets/models/minimax-primary.webp', alt: 'Spacecraft scene from the MiniMax H3 base-model family demo; Fast H3 is a distilled variant' },
    secondary: { src: '/assets/models/minimax-secondary.webp', alt: 'Outdoor scene from the MiniMax H3 base-model family demo; not a separate Fast H3 output' },
  },
  'wan-22': {
    name: 'Wan 2.2',
    description: 'A video generation family with mixture-of-experts models, cinematic aesthetic control, and detailed motion generation.',
    features: ['Mixture of experts', 'Cinematic aesthetics', 'Text / image to video', '720p · 24 FPS (5B)', '5B hybrid model'],
    recommendedFor: 'Filmmakers exploring lighting and composition, creators animating reference images, and developers using the 5B hybrid model for 720p video workflows on a consumer GPU.',
    repository: 'https://github.com/Wan-Video/Wan2.2',
    releasedOn: '2025. 07. 28',
    primary: { src: '/assets/models/wan-secondary.png', alt: 'Railway scene used in the official Wan 2.2 Five Hundred Miles example' },
    secondary: { src: '/assets/models/wan-primary.jpg', alt: 'Cat in sunglasses, an official Wan 2.2 image-to-video input example' },
  },
  'ltx-25': {
    name: 'LTX-2.5',
    description: 'Joint audio and video generation with synchronized sound, native HDR workflows, and efficient local inference options.',
    features: ['Synchronized audio', 'HDR / 16-bit EXR', 'Single GPU options', 'Gemma 4 encoder', 'Distilled pipelines'],
    recommendedFor: 'Creators building scenes with synchronized sound, filmmakers working with HDR and EXR material, and developers who want flexible local inference with quantization and CPU offloading.',
    repository: 'https://github.com/Lightricks/LTX-2',
    releasedOn: '2026. 08. 11',
    ...ltxMedia,
  },
  'ltx-23': {
    name: 'LTX-2.3',
    description: 'A 22B-parameter audio-video model with development and distilled checkpoints, spatial upscaling, and creative control adapters.',
    features: ['22B parameters', 'Joint audio / video', '1.5× / 2× upscaling', 'Control LoRAs', 'Gemma 3 encoder'],
    recommendedFor: 'Developers who need the LTX-2.3 checkpoint family, creators experimenting with pose or camera controls, and teams combining audio-video generation with spatial and temporal upscaling.',
    repository: 'https://github.com/Lightricks/LTX-2',
    documentation: 'https://github.com/Lightricks/LTX-2/blob/main/MODELS-LTX-2.3.md',
    releasedOn: '2026. 03. 05',
    ...ltxMedia,
  },
  'ltx-23-fast': {
    name: 'LTX-2.3 Fast',
    description: 'The distilled LTX-2.3 variant for shorter inference cycles, retaining the model family’s joint audio and video generation.',
    features: ['Distilled checkpoint', '22B parameters', 'Joint audio / video', 'Fewer sampling steps', 'Local inference'],
    recommendedFor: 'Creators iterating on scene ideas, developers testing prompts and conditioning inputs, and teams choosing the documented distilled LTX-2.3 checkpoint for a faster generation workflow.',
    repository: 'https://github.com/Lightricks/LTX-2',
    documentation: 'https://github.com/Lightricks/LTX-2/blob/main/MODELS-LTX-2.3.md',
    releasedOn: '2026. 03. 05',
    ...ltxMedia,
  },
  kandinsky: {
    name: 'Kandinsky 5.0',
    description: 'An open diffusion model family for text-to-image, text-to-video, and image-to-video creation, with Lite and Pro video models.',
    features: ['Video / image models', '2B Lite / 19B Pro', '5 / 10 second video', 'English / Russian', 'Motion control LoRA'],
    recommendedFor: 'Creators exploring both still images and moving scenes, teams working with English or Russian prompts, and developers choosing between compact Lite and larger Pro video workflows.',
    repository: 'https://github.com/kandinskylab/kandinsky-5',
    releasedOn: '2025. 09. 29',
    primary: { src: '/assets/models/kandinsky-primary.jpg', alt: 'Geometric Kandinsky artwork from the official Kandinsky 5 image generation examples' },
    secondary: { src: '/assets/models/kandinsky-secondary.jpg', alt: 'Skaters on a city ice rink from the official Kandinsky 5 image generation examples' },
  },
  cogvideo: {
    name: 'CogVideoX-5B',
    description: 'A 5B-parameter video generation model with text-to-video support, an image-conditioned variant, and LoRA fine-tuning tools.',
    features: ['5B parameters', 'Text to video', 'Image-conditioned variant', 'LoRA fine-tuning', 'Diffusers support'],
    recommendedFor: 'Developers prototyping open video generation, creators animating still references with the I2V variant, and researchers adapting video models with the repository’s training and inference tools.',
    repository: 'https://github.com/zai-org/CogVideo',
    releasedOn: '2024. 08. 27',
    primary: { src: '/assets/models/cogvideo-primary.png', alt: 'Lakeside campfire input image from the official CogVideoX Gradio demo' },
    secondary: { src: '/assets/models/cogvideo-secondary.png', alt: 'Sunset beach input image from the official CogVideoX Gradio demo' },
  },
  longcat: {
    name: 'LongCat Avatar',
    description: 'Audio-driven avatar video generation with expressive motion, identity preservation, and continuation for longer sequences.',
    features: ['Audio-driven avatars', 'Single / multi-speaker', 'Identity preservation', 'Video continuation', 'Long-form stitching'],
    recommendedFor: 'Teams creating virtual presenters, dialogue scenes, or singing avatars, and developers combining reference images with audio to produce expressive character videos and longer continuous sequences.',
    repository: 'https://github.com/MeiGen-AI/LongCat-Video-Avatar',
    releasedOn: '2025. 12. 16',
    primary: { src: '/assets/models/longcat-primary.png', alt: 'Singer reference image from the official LongCat Video Avatar demo' },
    secondary: { src: '/assets/models/longcat-secondary.webp', alt: 'Speaking actor from an official LongCat Video Avatar video demo' },
  },
  mova: {
    name: 'MOVA',
    description: 'MOSS Video and Audio: an open model for synchronized audiovisual generation, multilingual speech, and environmental sound.',
    features: ['Joint audio / video', 'Multilingual lip sync', 'Environmental sound', 'Open training code', 'LoRA fine-tuning'],
    recommendedFor: 'Creators making scenes with speech and sound effects, developers exploring synchronized audio-video generation, and teams adapting an open model to specific speakers, subjects, or creative workflows.',
    repository: 'https://github.com/OpenMOSS/MOVA',
    releasedOn: '2026. 01. 29',
    primary: { src: '/assets/models/mova-primary.jpg', alt: 'Single-person reference scene from the official MOVA demo assets' },
    secondary: { src: '/assets/models/mova-secondary.png', alt: 'Multi-person reference scene from the official MOVA demo assets' },
  },
};
