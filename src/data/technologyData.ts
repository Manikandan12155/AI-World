export interface TechnologyNode {
  id: string;
  name: string;
  category: string;
  badge: string;
  position: [number, number, number]; // [x, y, z] in 3D world
  islandColor: string;
  glowColor: string;
  type: 'ai' | 'agents' | 'cloud' | 'security' | 'dev' | 'hardware' | 'jobs' | 'trending' | 'research';
  headline: string;
  description: string;
  stats: { label: string; value: string }[];
  trendingTopics: string[];
  keyTools: string[];
}

export interface NewsCardData {
  id: string;
  category: string;
  title: string;
  time: string;
  imageUrl: string;
  badgeColor: string;
  readTime: string;
  summary: string;
}

export const TECHNOLOGY_NODES: TechnologyNode[] = [
  {
    id: 'ai-genai',
    name: 'AI / GenAI',
    category: 'Artificial Intelligence',
    badge: 'AI / GenAI >',
    position: [0.8, 3.4, 0.4],
    islandColor: '#8b5cf6',
    glowColor: '#a855f7',
    type: 'ai',
    headline: 'Frontier Foundation Models & Generative Workflows',
    description: 'Autonomous reasoning, multimodal diffusion, large context reasoning, and real-time generation frameworks shaping 2026 and beyond.',
    stats: [
      { label: 'Active Models', value: '4,200+' },
      { label: 'Weekly Research', value: '+34%' },
      { label: 'Compute Index', value: '98.6' }
    ],
    trendingTopics: ['Multimodal LLMs', 'Reasoning Tokens', 'Diffusion Video', 'Context Compression'],
    keyTools: ['Claude 3.7', 'GPT-4o', 'Gemini 2.5', 'Llama 3.3', 'DeepSeek-V3']
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    category: 'Autonomous Systems',
    badge: 'AI Agents >',
    position: [3.3, 2.7, 0.8],
    islandColor: '#38bdf8',
    glowColor: '#0ea5e9',
    type: 'agents',
    headline: 'Agentic Workflows & Autonomous Multi-Agent Swarms',
    description: 'Autonomous agentic loop architectures executing complex engineering, memory orchestration, tool calling, and workflow automation.',
    stats: [
      { label: 'Active Frameworks', value: '180+' },
      { label: 'Enterprise Adoption', value: '62%' },
      { label: 'Self-Healing Rate', value: '91.4%' }
    ],
    trendingTopics: ['LangGraph', 'CrewAI', 'AutoGen', 'MCP (Model Context Protocol)', 'Agent Swarms'],
    keyTools: ['Antigravity AGY', 'LangGraph', 'CrewAI', 'Claude Computer Use', 'OpenHands']
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'Infrastructure & Edge',
    badge: 'Cloud >',
    position: [4.2, 1.3, -0.2],
    islandColor: '#60a5fa',
    glowColor: '#3b82f6',
    type: 'cloud',
    headline: 'Next-Gen Hyperscalers & Distributed AI Clusters',
    description: 'Ultra-low latency edge compute, distributed GPU inference clusters, and sovereign cloud infrastructure for enterprise intelligence.',
    stats: [
      { label: 'Global Regions', value: '420+' },
      { label: 'GPU Cluster TFLOPS', value: '12.8M' },
      { label: 'Uptime Reliability', value: '99.999%' }
    ],
    trendingTopics: ['Distributed Inference', 'Serverless GPU', 'Multi-Cloud Mesh', 'Green Data Centers'],
    keyTools: ['AWS Bedrock', 'Cloudflare Workers', 'GCP Vertex AI', 'Azure OpenAI', 'Fly.io']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Defensive & Zero-Trust',
    badge: 'Cybersecurity >',
    position: [3.8, -0.9, 0.5],
    islandColor: '#06b6d4',
    glowColor: '#0891b2',
    type: 'security',
    headline: 'Zero-Trust Architecture & AI Defensive Shielding',
    description: 'Post-quantum cryptographic defenses, automated zero-day detection, prompt injection shields, and sovereign data boundary enforcement.',
    stats: [
      { label: 'Zero-Days Neutralized', value: '1,450+' },
      { label: 'Threat Response', value: '< 180ms' },
      { label: 'Security Score', value: '99.4%' }
    ],
    trendingTopics: ['Post-Quantum Encryption', 'Prompt Injection Defense', 'Zero-Trust Mesh', 'Kernel Sandboxing'],
    keyTools: ['Wiz', 'CrowdStrike Falcon', 'Cloudflare Zero Trust', 'Snyk', 'Tenable AI']
  },
  {
    id: 'development',
    name: 'Development',
    category: 'Software Engineering',
    badge: 'Development >',
    position: [2.5, -2.4, 1.2],
    islandColor: '#38bdf8',
    glowColor: '#0284c7',
    type: 'dev',
    headline: 'Modern Web Engineering & Full-Stack Tooling',
    description: 'Reactive frontends, compiler-optimized rendering engines, distributed state machines, and high-performance WebAssembly runtimes.',
    stats: [
      { label: 'GitHub Repos Analyzed', value: '12M+' },
      { label: 'Daily Builds', value: '450K+' },
      { label: 'Framework Velocity', value: '+44%' }
    ],
    trendingTopics: ['React 19 Server Components', 'Vite 6', 'Next.js 15', 'TypeScript 5.8', 'Rust WASM'],
    keyTools: ['React 19', 'TypeScript', 'Tailwind v4', 'Vite', 'Turbopack']
  },
  {
    id: 'hardware',
    name: 'Hardware',
    category: 'Silicon & Semiconductors',
    badge: 'Hardware >',
    position: [-0.6, -3.2, 0.8],
    islandColor: '#f59e0b',
    glowColor: '#d97706',
    type: 'hardware',
    headline: 'Blackwell Architectures & Custom Silicon Accelerators',
    description: 'Next-generation 2nm silicon wafers, optical interconnects, HBM3e high-bandwidth memory, and localized NPU on-device coprocessors.',
    stats: [
      { label: 'Transistor Density', value: '208B' },
      { label: 'Energy Efficiency', value: '+3.5x' },
      { label: 'FP8 Tensor PFLOPS', value: '20.0' }
    ],
    trendingTopics: ['NVIDIA Blackwell B200', 'Apple M4 Max', 'Groq LPU', 'Optical Interconnects', 'Cerebras WSE-3'],
    keyTools: ['CUDA 13', 'TensorRT-LLM', 'Triton Compiler', 'ONNX Runtime', 'Qualcomm NPU']
  },
  {
    id: 'tech-jobs',
    name: 'Tech Jobs',
    category: 'Career & Engineering Talent',
    badge: 'Tech Jobs >',
    position: [-2.9, -2.2, 1.0],
    islandColor: '#0ea5e9',
    glowColor: '#0284c7',
    type: 'jobs',
    headline: 'Global Tech Careers & AI Engineer Demand',
    description: 'High-leverage engineering roles, prompt & fine-tuning architects, systems engineers, and autonomous agent orchestration specialists.',
    stats: [
      { label: 'Open Positions', value: '48,200+' },
      { label: 'Avg AI Salary', value: '$225,000' },
      { label: 'Remote Ratio', value: '74%' }
    ],
    trendingTopics: ['AI Systems Engineer', 'Agentic Workflow Architect', 'MLOps Specialist', 'Kernel Developer'],
    keyTools: ['GitHub Jobs', 'Wellfound', 'LinkedIn Tech', 'Levels.fyi', 'Y Combinator Workatastartup']
  },
  {
    id: 'trending',
    name: 'Trending',
    category: 'Signals & Market Movers',
    badge: 'Trending >',
    position: [-3.4, 0.6, 0.5],
    islandColor: '#06b6d4',
    glowColor: '#0891b2',
    type: 'trending',
    headline: 'Real-Time Tech Momentum & Market Velocity',
    description: 'Algorithmic tracking of developer adoption spikes, starred repositories, research citations, and venture intelligence in real time.',
    stats: [
      { label: 'Tracked Signals', value: '95,000/sec' },
      { label: 'Surging Repos', value: '312' },
      { label: 'Sentiment Index', value: 'Bullish (+78)' }
    ],
    trendingTopics: ['Local Reasoning Models', 'WebLLM WebGPU', 'Robotics Foundation Models', 'Synthetic Data'],
    keyTools: ['Hugging Face Hub', 'GitHub Trending', 'Product Hunt', 'Papers With Code', 'ArXiv CS']
  },
  {
    id: 'research',
    name: 'Research',
    category: 'Deep Science & Frontiers',
    badge: 'Research >',
    position: [-2.1, 2.6, 0.4],
    islandColor: '#94a3b8',
    glowColor: '#cbd5e1',
    type: 'research',
    headline: 'ArXiv Breakthroughs, Quantum & AGI Milestones',
    description: 'Peer-reviewed research in quantum computing, neural algorithmic reasoning, bio-computational synthesis, and scalable superalignment.',
    stats: [
      { label: 'Papers Indexed', value: '14,200+' },
      { label: 'Citation Growth', value: '+52%' },
      { label: 'Patents Filed', value: '890' }
    ],
    trendingTopics: ['Chain of Continuous Thought', 'State Space Models (Mamba)', 'Quantum Superposition', 'Mechanistic Interpretability'],
    keyTools: ['ArXiv', 'Google DeepMind Publications', 'OpenAI Research', 'Anthropic Frontier', 'Meta FAIR']
  }
];

export const MOCK_NEWS_CARDS: NewsCardData[] = [
  {
    id: 'news-1',
    category: 'AI',
    title: 'OpenAI Unveils Next-Gen Model with Multimodal Abilities',
    time: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    readTime: '3 min read',
    summary: 'Revolutionary real-time multimodal model with native audio, vision, and deep step-by-step reasoning capability.'
  },
  {
    id: 'news-2',
    category: 'CLOUD',
    title: 'AWS Expands AI Infrastructure in 2026',
    time: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    readTime: '4 min read',
    summary: 'Amazon Web Services deploys ultra-dense GPU clusters and dedicated optical interconnect networks worldwide.'
  },
  {
    id: 'news-3',
    category: 'CYBERSECURITY',
    title: 'New Zero-Day Vulnerability Discovered',
    time: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    readTime: '5 min read',
    summary: 'Autonomous defense AI shields mitigate novel zero-day exploit within 140ms of initial probe detection.'
  },
  {
    id: 'news-4',
    category: 'DEVELOPMENT',
    title: 'React 19 Released – What\'s New?',
    time: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    readTime: '6 min read',
    summary: 'Full React Server Actions, native asset preloading, compiler-level memoization, and streamlined optimistic hooks.'
  },
  {
    id: 'news-5',
    category: 'HARDWARE',
    title: 'NVIDIA\'s Next-Gen GPUs Leak Online',
    time: '10 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    readTime: '4 min read',
    summary: 'Leaked architectural benchmarks demonstrate unprecedented FP8 throughput and 288GB unified HBM3e VRAM configurations.'
  }
];
