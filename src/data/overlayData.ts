export interface TechNodeOverlay {
  id: string;
  name: string;
  category: string;
  badge: string;
  top: string;   // Percentage from top
  left: string;  // Percentage from left
  glowColor: string;
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
  badgeColor: string;
  readTime: string;
  summary: string;
}

// Exact coordinate placement based on ChatGPT Image Sep 18, 2026, 11_38_14 AM.png
export const TECH_NODES_OVERLAY: TechNodeOverlay[] = [
  {
    id: 'ai-genai',
    name: 'AI / GenAI',
    category: 'Artificial Intelligence',
    badge: 'AI / GenAI ›',
    top: '10.5%',
    left: '52.5%',
    glowColor: '#a855f7',
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
    id: 'research',
    name: 'Research',
    category: 'Deep Science & Frontiers',
    badge: 'Research ›',
    top: '16%',
    left: '37%',
    glowColor: '#cbd5e1',
    headline: 'ArXiv Breakthroughs, Quantum & AGI Milestones',
    description: 'Peer-reviewed research in quantum computing, neural algorithmic reasoning, bio-computational synthesis, and scalable superalignment.',
    stats: [
      { label: 'Papers Indexed', value: '14,200+' },
      { label: 'Citation Growth', value: '+52%' },
      { label: 'Patents Filed', value: '890' }
    ],
    trendingTopics: ['Chain of Continuous Thought', 'State Space Models (Mamba)', 'Quantum Superposition'],
    keyTools: ['ArXiv CS', 'Google DeepMind', 'OpenAI Research', 'Anthropic Frontier']
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    category: 'Autonomous Systems',
    badge: 'AI Agents ›',
    top: '16.5%',
    left: '69.5%',
    glowColor: '#38bdf8',
    headline: 'Agentic Workflows & Autonomous Multi-Agent Swarms',
    description: 'Autonomous agentic loop architectures executing complex engineering, memory orchestration, tool calling, and workflow automation.',
    stats: [
      { label: 'Active Frameworks', value: '180+' },
      { label: 'Enterprise Adoption', value: '62%' },
      { label: 'Self-Healing Rate', value: '91.4%' }
    ],
    trendingTopics: ['LangGraph', 'CrewAI', 'AutoGen', 'Model Context Protocol (MCP)'],
    keyTools: ['Antigravity AGY', 'LangGraph', 'CrewAI', 'Claude Computer Use']
  },
  {
    id: 'trending',
    name: 'Trending',
    category: 'Signals & Market Movers',
    badge: 'Trending ›',
    top: '33.5%',
    left: '33.5%',
    glowColor: '#06b6d4',
    headline: 'Real-Time Tech Momentum & Market Velocity',
    description: 'Algorithmic tracking of developer adoption spikes, starred repositories, research citations, and venture intelligence in real time.',
    stats: [
      { label: 'Tracked Signals', value: '95,000/sec' },
      { label: 'Surging Repos', value: '312' },
      { label: 'Sentiment Index', value: 'Bullish (+78)' }
    ],
    trendingTopics: ['Local Reasoning Models', 'WebLLM WebGPU', 'Robotics Foundation Models'],
    keyTools: ['Hugging Face Hub', 'GitHub Trending', 'Product Hunt', 'Papers With Code']
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'Infrastructure & Edge',
    badge: 'Cloud ›',
    top: '28.5%',
    left: '81.5%',
    glowColor: '#60a5fa',
    headline: 'Next-Gen Hyperscalers & Distributed AI Clusters',
    description: 'Ultra-low latency edge compute, distributed GPU inference clusters, and sovereign cloud infrastructure for enterprise intelligence.',
    stats: [
      { label: 'Global Regions', value: '420+' },
      { label: 'GPU Cluster TFLOPS', value: '12.8M' },
      { label: 'Uptime Reliability', value: '99.999%' }
    ],
    trendingTopics: ['Distributed Inference', 'Serverless GPU', 'Multi-Cloud Mesh'],
    keyTools: ['AWS Bedrock', 'Cloudflare Workers', 'GCP Vertex AI', 'Azure OpenAI']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Defensive & Zero-Trust',
    badge: 'Cybersecurity ›',
    top: '42.5%',
    left: '82.5%',
    glowColor: '#06b6d4',
    headline: 'Zero-Trust Architecture & AI Defensive Shielding',
    description: 'Post-quantum cryptographic defenses, automated zero-day detection, prompt injection shields, and sovereign data boundary enforcement.',
    stats: [
      { label: 'Zero-Days Neutralized', value: '1,450+' },
      { label: 'Threat Response', value: '< 180ms' },
      { label: 'Security Score', value: '99.4%' }
    ],
    trendingTopics: ['Post-Quantum Encryption', 'Prompt Injection Defense', 'Zero-Trust Mesh'],
    keyTools: ['Wiz', 'CrowdStrike Falcon', 'Cloudflare Zero Trust', 'Snyk']
  },
  {
    id: 'development',
    name: 'Development',
    category: 'Software Engineering',
    badge: 'Development ›',
    top: '56.5%',
    left: '73%',
    glowColor: '#38bdf8',
    headline: 'Modern Web Engineering & Full-Stack Tooling',
    description: 'Reactive frontends, compiler-optimized rendering engines, distributed state machines, and high-performance WebAssembly runtimes.',
    stats: [
      { label: 'GitHub Repos Analyzed', value: '12M+' },
      { label: 'Daily Builds', value: '450K+' },
      { label: 'Framework Velocity', value: '+44%' }
    ],
    trendingTopics: ['React 19 Server Components', 'Vite 6', 'Next.js 15', 'TypeScript 5.8'],
    keyTools: ['React 19', 'TypeScript', 'Tailwind v4', 'Vite']
  },
  {
    id: 'hardware',
    name: 'Hardware',
    category: 'Silicon & Semiconductors',
    badge: 'Hardware ›',
    top: '63.5%',
    left: '52.5%',
    glowColor: '#f59e0b',
    headline: 'Blackwell Architectures & Custom Silicon Accelerators',
    description: 'Next-generation 2nm silicon wafers, optical interconnects, HBM3e high-bandwidth memory, and localized NPU on-device coprocessors.',
    stats: [
      { label: 'Transistor Density', value: '208B' },
      { label: 'Energy Efficiency', value: '+3.5x' },
      { label: 'FP8 Tensor PFLOPS', value: '20.0' }
    ],
    trendingTopics: ['NVIDIA Blackwell B200', 'Apple M4 Max', 'Groq LPU'],
    keyTools: ['CUDA 13', 'TensorRT-LLM', 'Triton Compiler']
  },
  {
    id: 'tech-jobs',
    name: 'Tech Jobs',
    category: 'Career & Engineering Talent',
    badge: 'Tech Jobs ›',
    top: '51.5%',
    left: '38.5%',
    glowColor: '#0ea5e9',
    headline: 'Global Tech Careers & AI Engineer Demand',
    description: 'High-leverage engineering roles, prompt & fine-tuning architects, systems engineers, and autonomous agent orchestration specialists.',
    stats: [
      { label: 'Open Positions', value: '48,200+' },
      { label: 'Avg AI Salary', value: '$225,000' },
      { label: 'Remote Ratio', value: '74%' }
    ],
    trendingTopics: ['AI Systems Engineer', 'Agentic Workflow Architect', 'MLOps Specialist'],
    keyTools: ['GitHub Jobs', 'Wellfound', 'Levels.fyi']
  }
];

export const MOCK_NEWS_DATA: NewsCardData[] = [
  {
    id: 'news-1',
    category: 'AI',
    title: 'OpenAI Unveils Next-Gen Model with Multimodal Abilities',
    time: '2 hours ago',
    badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-500/40',
    readTime: '3 min read',
    summary: 'Revolutionary real-time multimodal model with native audio, vision, and deep step-by-step reasoning capability.'
  },
  {
    id: 'news-2',
    category: 'CLOUD',
    title: 'AWS Expands AI Infrastructure in 2026',
    time: '4 hours ago',
    badgeColor: 'bg-sky-900/60 text-sky-300 border-sky-500/40',
    readTime: '4 min read',
    summary: 'Amazon Web Services deploys ultra-dense GPU clusters and dedicated optical interconnect networks worldwide.'
  },
  {
    id: 'news-3',
    category: 'CYBERSECURITY',
    title: 'New Zero-Day Vulnerability Discovered',
    time: '6 hours ago',
    badgeColor: 'bg-teal-900/60 text-teal-300 border-teal-500/40',
    readTime: '5 min read',
    summary: 'Autonomous defense AI shields mitigate novel zero-day exploit within 140ms of initial probe detection.'
  },
  {
    id: 'news-4',
    category: 'DEVELOPMENT',
    title: 'React 19 Released – What\'s New?',
    time: '8 hours ago',
    badgeColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40',
    readTime: '6 min read',
    summary: 'Full React Server Actions, native asset preloading, compiler-level memoization, and streamlined optimistic hooks.'
  },
  {
    id: 'news-5',
    category: 'HARDWARE',
    title: 'NVIDIA\'s Next-Gen GPUs Leak Online',
    time: '10 hours ago',
    badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
    readTime: '4 min read',
    summary: 'Leaked architectural benchmarks demonstrate unprecedented FP8 throughput and 288GB unified HBM3e VRAM configurations.'
  }
];
