import "./Chatwithelliot.scss";
import DOMPurify from "dompurify";
import { stripHtmlTags } from "../../Utils/htmlTextUtils";

import {
  Avatar,
  Box,
  Divider,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  Slide,
  Button,
  IconButton,
  Menu,
  Popover,
  Slider,
  CircularProgress
} from "@mui/material";
import * as Lucide from "lucide-react";

const createMuiLucide = (LucideIcon: any) => {
  return ({ fontSize, sx, ...props }: any) => {
    let size = 20;
    if (fontSize === "small") size = 18;
    if (fontSize === "medium") size = 24;
    if (fontSize === "large") size = 32;
    if (sx?.fontSize) size = Number.parseInt(sx.fontSize as string) || size;
    const rawColor = sx?.color || props.color;
    const styleColor = (rawColor === "inherit" || !rawColor) ? 'currentColor' : rawColor;
    return <LucideIcon size={size} color={styleColor} style={sx} {...props} />;
  };
};

const AddIcon = createMuiLucide(Lucide.Plus);
const MessageSquarePlusIcon = createMuiLucide(Lucide.MessageSquarePlus);
const ChatBubbleOutlineIcon = createMuiLucide(Lucide.MessageCircle);
const MessageCircleDashedIcon = createMuiLucide(Lucide.MessageCircleDashed);
const DeleteOutlineIcon = createMuiLucide(Lucide.Trash2);
const MoreHorizIcon = createMuiLucide(Lucide.MoreHorizontal);
const TrendingUpIcon = createMuiLucide(Lucide.TrendingUp);
const MenuBookIcon = createMuiLucide(Lucide.BookOpen);
const LightbulbIcon = createMuiLucide(Lucide.Lightbulb);
const QuizIcon = createMuiLucide(Lucide.HelpCircle);
const SchoolIcon = createMuiLucide(Lucide.GraduationCap);
const PushPinIcon = createMuiLucide(Lucide.Pin);
const ArchiveIcon = createMuiLucide(Lucide.Archive);
const EditIcon = createMuiLucide(Lucide.Edit2);
const UnarchiveIcon = createMuiLucide(Lucide.ArchiveRestore);
const CloseIcon = createMuiLucide(Lucide.X);
const SearchIcon = createMuiLucide(Lucide.Search);
const DeleteSweepIcon = createMuiLucide(Lucide.Trash);
const MicIcon = createMuiLucide(Lucide.Mic);
const MicNoneIcon = createMuiLucide(Lucide.Mic);
const MicOffIcon = createMuiLucide(Lucide.MicOff);
const MicVocalIcon = createMuiLucide(Lucide.MicVocal);
const SpeechIcon = createMuiLucide(Lucide.Speech);
const HeadphonesIcon = createMuiLucide(Lucide.Headphones);
const VolumeUpIcon = createMuiLucide(Lucide.Volume2);
const VolumeOffIcon = createMuiLucide(Lucide.VolumeX);
const PlayArrowIcon = createMuiLucide(Lucide.Play);
const PauseIcon = createMuiLucide(Lucide.Pause);
const StopIcon = createMuiLucide(Lucide.Square);
const ChevronDownIcon = createMuiLucide(Lucide.ChevronDown);
const ChevronRightIcon = createMuiLucide(Lucide.ChevronRight);
const ChevronLeftIcon = createMuiLucide(Lucide.ChevronLeft);
const CallEndIcon = createMuiLucide(Lucide.PhoneOff);
const FormatQuoteIcon = createMuiLucide(Lucide.Quote);
const HearingIcon = createMuiLucide(Lucide.Ear);
const HearingDisabledIcon = createMuiLucide(Lucide.EarOff);
const AttachFileIcon = createMuiLucide(Lucide.Paperclip);
const DownloadIcon = createMuiLucide(Lucide.Download);
const SnailIcon = createMuiLucide(Lucide.Snail);
const RabbitIcon = createMuiLucide(Lucide.Rabbit);
const GaugeIcon = createMuiLucide(Lucide.Gauge);
const HistoryIcon = createMuiLucide(Lucide.History);
const DescriptionIcon = createMuiLucide(Lucide.FileText);
const PictureAsPdfIcon = createMuiLucide(Lucide.FileText);
const InsertDriveFileIcon = createMuiLucide(Lucide.File);
const TableChartIcon = createMuiLucide(Lucide.Table);
const SlideshowIcon = createMuiLucide(Lucide.MonitorPlay);
const FolderZipIcon = createMuiLucide(Lucide.FileArchive);
const AutoAwesomeIcon = createMuiLucide(Lucide.Sparkles);
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../Redux/Store/Hooks";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import ReactECharts from "echarts-for-react";
import sendImage from "../../Assets/Images/Send_icon.svg";
import {
  IChatbotPublic,
} from "../../Components/ChatbotPublic/IChatbotPublic";
import TextInputFieldC from "../../Components/TextInput/TextInputFieldC";
import IconButtonField from "../../Components/Button/IconButtonField";
import AvatarImage from "../../Assets/Images/Chatbot_Avatar.png";
const ThumbUpOffAltIcon = createMuiLucide(Lucide.ThumbsUp);
const ThumbDownOffAltIcon = createMuiLucide(Lucide.ThumbsDown);
const CheckIcon = createMuiLucide(Lucide.Check);
const ContentCopyIcon = createMuiLucide(Lucide.Copy);
const ZapIcon = createMuiLucide(Lucide.Zap);
const PanelLeftOpenIcon = createMuiLucide(Lucide.PanelLeftOpen);
const PanelLeftCloseIcon = createMuiLucide(Lucide.PanelLeftClose)
import {
  ChatWithElliot,
  clearChatWithElliotStatus,
  successChatWithElliot,
} from "../../Redux/Slices/ChatwithElliot/ChatwithElliot";
import { clearChatbotPublicStatus } from "../../Redux/Slices/ChatbotPublic/ChatbotPublicSlicer";
import TypewriterMarkdown from "../../Components/TypewriterMarkdown/TypewriterMarkdown";
import { MathWidget } from "../../Components/DesmosWidget/MathWidget";
import api from "../../Redux/Axios/middleware";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getMockResponse = (
  agent: string,
  userMessage: string,
): string | undefined => {
  const msg = userMessage.toLowerCase();

  if (agent === "Warehouse Agent") {
    if (
      msg.includes("status") ||
      msg.includes("stock") ||
      msg.includes("check")
    ) {
      return "**Warehouse status update:**\n\n- All zones (A to F) are operating at normal capacity.\n- Inbound docks have 3 shipments pending verification.\n- Outbound dispatch is on schedule.\n\nEnna item status check panna venum?";
    }
    return "Warehouse Agent is online.\n\nI can help you monitor warehouse zones, check shipment queues, and track layout updates. Ask me anything about warehouse management.";
  }

  if (agent === "Inventory Agent") {
    if (msg.includes("stock") || msg.includes("limit") || msg.includes("low")) {
      return "**Inventory Stock Alert:**\n\n- **Low Stock:** 4 items (Item ID: #INV-402, #INV-109, etc.) are below the reorder point.\n- **Overstock:** Zone C is nearing maximum capacity for electronics.\n\nEnna item list check panna clean details code venum?";
    }
    return "Inventory Agent online.\n\nI can assist you in checking current stock levels, monitoring low-stock items, managing SKU details, and verifying inventory counts. What inventory query do you have today?";
  }

  if (agent === "Sales Agent") {
    if (
      msg.includes("report") ||
      msg.includes("performance") ||
      msg.includes("sales")
    ) {
      return "**Sales Performance Summary:**\n\n- **Daily Target:** 92% achieved.\n- **Active Deals:** 14 high-value deals in pipeline.\n- **New Leads:** 28 added today.\n\nShall I list the top performing deals?";
    }
    return "Sales Agent active.\n\nI can help you analyze sales reports, track deals in progress, check customer conversion rates, and generate lead lists. Let me know what you need.";
  }

  if (agent === "Support Agent") {
    if (
      msg.includes("ticket") ||
      msg.includes("help") ||
      msg.includes("issue")
    ) {
      return "**Support Desk Queue:**\n\n- **Open Tickets:** 5 (3 High priority, 2 Normal).\n- **Average Resolution Time:** 14 minutes.\n\nDo you want me to pull up details for a specific ticket ID?";
    }
    return "Support Agent at your service.\n\nI can retrieve customer support ticket statuses, escalate critical issues, search the knowledge base, or draft email replies. Please share your issue.";
  }


};

const RotatingTextLoader = () => {
  const loadingTexts = useMemo(
    () => [
      { text: "Initializing neural networks" },
      { text: "Processing context" },
      { text: "Synthesizing data" },
      { text: "Generating response" },
      { text: "Refining output" },
      { text: "Consulting knowledge base" },
      { text: "Formulating insights" },
      { text: "Deep thinking" },
      { text: "Analyzing query" },
      { text: "Optimizing results" },
    ],
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize random index once on mount
  useEffect(() => {
    setCurrentIndex(Math.floor((window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * loadingTexts.length)); // NOSONAR: Safe — used only for choosing initial loading message index, not security-sensitive.
  }, [loadingTexts]);

  // Typewriter and erase effect
  useEffect(() => {
    const fullText = loadingTexts[currentIndex].text;
    const typingSpeed = isDeleting ? 30 : 50;

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText !== fullText) {
        // Typing forward
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      } else if (!isDeleting && displayedText === fullText) {
        // Pause at the end before deleting
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText !== "") {
        // Erasing backward
        setDisplayedText(fullText.slice(0, displayedText.length - 1));
      } else if (isDeleting && displayedText === "") {
        // Move to next word
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % loadingTexts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentIndex, loadingTexts]);



  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box className="base" sx={{ mr: 2 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`circ-${i + 1}`} className={`circ circ-${i + 1}`} />
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            fontStyle: "italic",
            fontWeight: 600,
            background:
              "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #3b82f6 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation:
              "shimmer 2s infinite linear, pulseGlow 2s infinite ease-in-out",
          }}
        >
          {displayedText}
          <span className="blinking-cursor">|</span>
        </Typography>
        <SearchIcon
          sx={{
            color: "#a855f7",
            fontSize: "20px",
            animation:
              "pulseGlow 2s infinite ease-in-out, searchFloat 3s infinite ease-in-out",
            marginLeft: "4px",
          }}
        />
      </Box>
      <style>
        {`
        .base {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .circ {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          position: absolute;
          transform-style: preserve-3d;
          backdrop-filter: blur(0.5px);
          border: 1.5px solid #009dff;
          box-shadow: 0 0 6px #009dff;
          opacity: 0;
        }
        .circ.circ-1 {
          transform: rotate3d(0, 1, 0, 24deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.1333s;
          border-color: #009dff;
          box-shadow: 0 0 6px #009dff;
        }
        .circ.circ-2 {
          transform: rotate3d(0, 1, 0, 48deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.2667s;
          border-color: #00f2fe;
          box-shadow: 0 0 6px #00f2fe;
        }
        .circ.circ-3 {
          transform: rotate3d(0, 1, 0, 72deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.4s;
          border-color: #a855f7;
          box-shadow: 0 0 6px #a855f7;
        }
        .circ.circ-4 {
          transform: rotate3d(0, 1, 0, 96deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.5333s;
          border-color: #ec4899;
          box-shadow: 0 0 6px #ec4899;
        }
        .circ.circ-5 {
          transform: rotate3d(0, 1, 0, 120deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.6667s;
          border-color: #6366f1;
          box-shadow: 0 0 6px #6366f1;
        }
        .circ.circ-6 {
          transform: rotate3d(0, 1, 0, 144deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.8s;
          border-color: #f59e0b;
          box-shadow: 0 0 6px #f59e0b;
        }
        .circ.circ-7 {
          transform: rotate3d(0, 1, 0, 168deg);
          animation: rotate 2s linear infinite;
          animation-delay: 0.9333s;
          border-color: #ef4444;
          box-shadow: 0 0 6px #ef4444;
        }
        .circ.circ-8 {
          transform: rotate3d(1, 0, 0, 192deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.0667s;
          border-color: #14b8a6;
          box-shadow: 0 0 6px #14b8a6;
        }
        .circ.circ-9 {
          transform: rotate3d(1, 0, 0, 216deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.2s;
          border-color: #84cc16;
          box-shadow: 0 0 6px #84cc16;
        }
        .circ.circ-10 {
          transform: rotate3d(1, 0, 0, 240deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.3333s;
          border-color: #f43f5e;
          box-shadow: 0 0 6px #f43f5e;
        }
        .circ.circ-11 {
          transform: rotate3d(1, 0, 0, 264deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.4667s;
          border-color: #10b981;
          box-shadow: 0 0 6px #10b981;
        }
        .circ.circ-12 {
          transform: rotate3d(1, 0, 0, 288deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.6s;
          border-color: #0ea5e9;
          box-shadow: 0 0 6px #0ea5e9;
        }
        .circ.circ-13 {
          transform: rotate3d(1, 0, 0, 312deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.7333s;
          border-color: #d8b4fe;
          box-shadow: 0 0 6px #d8b4fe;
        }
        .circ.circ-14 {
          transform: rotate3d(1, 0, 0, 336deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 1.8667s;
          border-color: #d946ef;
          box-shadow: 0 0 6px #d946ef;
        }
        .circ.circ-15 {
          transform: rotate3d(1, 0, 0, 360deg);
          animation: rotate-2 3s linear infinite;
          animation-delay: 2s;
          border-color: #4f46e5;
          box-shadow: 0 0 6px #4f46e5;
        }
        @keyframes rotate {
          from {
            opacity: 1;
            transform: rotate3d(0, 1, 1, 360deg);
          }
          to {
            transform: rotate3d(0, 1, 1, 0deg);
            opacity: 1;
          }
        }
        @keyframes rotate-2 {
          from {
            opacity: 1;
            transform: rotate3d(1, 0, 1, 0deg);
          }
          to {
            opacity: 1;
            transform: rotate3d(1, 0, 1, 360deg);
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(168, 85, 247, 0.4); filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.4)); }
          50% { text-shadow: 0 0 16px rgba(168, 85, 247, 0.8); filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.8)); }
        }
        @keyframes searchFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.1); }
        }
        .blinking-cursor {
          font-weight: 400;
          color: #a855f7;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}
      </style>
    </Box>
  );
};

interface VoiceSphereThreeProps {
  state: "listening" | "processing" | "speaking" | "interrupted" | "idle";
  speechRate?: number;
  isVoiceActive?: boolean;
}

const VoiceSphereThree: React.FC<VoiceSphereThreeProps> = ({ state, speechRate = 1, isVoiceActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);

  // Keep references to state and speechRate to avoid destroying/rebuilding scene on changes
  const stateRef = useRef(state);
  const speechRateRef = useRef(speechRate);
  const isVoiceActiveRef = useRef(isVoiceActive);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  useEffect(() => {
    isVoiceActiveRef.current = isVoiceActive;
  }, [isVoiceActive]);

  // Dynamically load Three.js if not already present
  useEffect(() => {
    if ((globalThis as any).THREE) {
      setThreeLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.className = "threejs-library-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.integrity = "sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => {
      setThreeLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Three.js scene once loaded
  useEffect(() => {
    if (!threeLoaded || !containerRef.current) return;

    const THREE = (globalThis as any).THREE;
    if (!THREE) return;

    const container = containerRef.current;
    const w = 240;
    const h = 240;

    const noiseShaderSource = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const radius = 1.25;
    const detail = 35;
    const geometry = THREE.IcosahedronGeometry
      ? new THREE.IcosahedronGeometry(1, detail)
      : new THREE.IcosahedronBufferGeometry(1, detail);

    const canvasSize = 32;
    const canvasH = canvasSize * 0.5;
    const drawCanvas = document.createElement("canvas");
    drawCanvas.width = drawCanvas.height = canvasSize;
    const ctx = drawCanvas.getContext("2d")!;
    const circle = new Path2D();
    circle.arc(canvasH, canvasH, canvasH - 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill(circle);
    const texture = new THREE.CanvasTexture(drawCanvas);

    // Initial color
    let dotColor = 0x009dff;
    if (stateRef.current === "processing") dotColor = 0xec4899;
    else if (stateRef.current === "interrupted") dotColor = 0xef4444;
    else if (stateRef.current === "speaking") dotColor = 0x10b981;

    const material = new THREE.PointsMaterial({
      map: texture,
      blending: THREE.NormalBlending,
      color: dotColor,
      depthTest: false,
      transparent: true,
    });

    let sizeMin = 0.015;
    let sizeMax = 0.08;

    if (stateRef.current === "speaking") {
      sizeMin = 0.03;
      sizeMax = 0.14;
    } else if (stateRef.current === "processing") {
      sizeMin = 0.01;
      sizeMax = 0.05;
    }

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.radius = { value: radius };
      shader.uniforms.particleSizeMin = { value: sizeMin };
      shader.uniforms.particleSizeMax = { value: sizeMax };
      shader.uniforms.noiseStrength = { value: 0.45 };

      shader.vertexShader = `
        uniform float particleSizeMax;
        uniform float particleSizeMin;
        uniform float radius;
        uniform float time;
        uniform float noiseStrength;
        ${noiseShaderSource}
        ${shader.vertexShader}
      `;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          vec3 p = position;
          float n = snoise( vec3( p.x * 0.8 + time * 0.4, p.y * 0.6 + time * 0.5, p.z * 0.4 + time * 0.3) );
          p += n * noiseStrength;
          float l = radius / length(p);
          p *= l;
          float s = mix(particleSizeMin, particleSizeMax, n);
          vec3 transformed = vec3( p.x, p.y, p.z );
        `,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = size;",
        "gl_PointSize = s;",
      );

      material.userData.shader = shader;
    };

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const animate = () => { // NOSONAR
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      const currentState = stateRef.current;
      const currentSpeechRate = speechRateRef.current;
      const voiceActive = isVoiceActiveRef.current;

      // Update color based on current state
      let targetColor = 0x009dff;
      if (currentState === "processing") targetColor = 0xec4899;
      else if (currentState === "interrupted") targetColor = 0xef4444;
      else if (currentState === "speaking") targetColor = 0x10b981;
      material.color.setHex(targetColor);

      // Update size uniforms based on current state
      let currentSizeMin = 0.015;
      let currentSizeMax = 0.08;
      if (currentState === "speaking") {
        currentSizeMin = 0.03;
        currentSizeMax = 0.14;
      } else if (currentState === "processing") {
        currentSizeMin = 0.01;
        currentSizeMax = 0.05;
      } else if (currentState === "listening" && voiceActive) {
        currentSizeMin = 0.035;
        currentSizeMax = 0.15;
      }

      let currentNoiseStrength = 0.45;
      if (currentState === "listening" && voiceActive) {
        currentNoiseStrength = 0.95; // organic wobble/deformation
      } else if (currentState === "processing") {
        currentNoiseStrength = 0.2;
      }

      if (material.userData.shader) {
        material.userData.shader.uniforms.particleSizeMin.value = currentSizeMin;
        material.userData.shader.uniforms.particleSizeMax.value = currentSizeMax;
        material.userData.shader.uniforms.noiseStrength.value = currentNoiseStrength;
      }

      let rotationSpeed = 0.15;
      if (currentState === "processing") rotationSpeed = 0.5;
      else if (currentState === "speaking") rotationSpeed = 0.25 * currentSpeechRate;
      else if (currentState === "listening" && voiceActive) rotationSpeed = 0.65;

      mesh.rotation.y = time * rotationSpeed;
      mesh.rotation.x = time * (rotationSpeed * 0.5);

      if (material.userData.shader) {
        let timeScale = 1;
        if (currentState === "speaking") timeScale = 2.2 * currentSpeechRate;
        else if (currentState === "processing") timeScale = 1.8;
        else if (currentState === "listening" && voiceActive) timeScale = 4.2;
        material.userData.shader.uniforms.time.value = time * timeScale;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        renderer.domElement.remove();
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [threeLoaded]);

  return (
    <div
      ref={containerRef}
      style={{
        width: 240,
        height: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 2,
      }}
    />
  );
};

const getFileIcon = (filename: string, sxProps: any) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <PictureAsPdfIcon sx={sxProps} />;
    case "doc":
    case "docx":
    case "txt":
    case "rtf":
      return <DescriptionIcon sx={sxProps} />;
    case "xls":
    case "xlsx":
    case "csv":
      return <TableChartIcon sx={sxProps} />;
    case "ppt":
    case "pptx":
      return <SlideshowIcon sx={sxProps} />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FolderZipIcon sx={sxProps} />;
    default:
      return <InsertDriveFileIcon sx={sxProps} />;
  }
};

const FeedbackAnimation = ({
  type,
  x,
  y,
}: {
  type: "helpful" | "not_helpful";
  x: number;
  y: number;
}) => {
  const particles = Array.from({ length: 30 });
  const isLike = type === "helpful";
  const emojis = isLike
    ? ["❤️", "💖", "🥰", "😍", "😊", "😃", "✨"]
    : ["😢", "😭", "💔", "😞", "🥺", "😔"];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      {particles.map((_, i) => {
        const angle = (window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * Math.PI * 2; // NOSONAR: Safe — visual particle explosion angle, not security-sensitive.
        const velocity = 80 + (window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * 200; // NOSONAR: Safe — visual particle explosion velocity, not security-sensitive.
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 150; // upward bias for explosion

        return (
          <motion.div
            key={i} // NOSONAR
            initial={{ opacity: 1, x: x, y: y, scale: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: x + tx,
              y: y + ty + 200, // fall down due to gravity
              scale: [0, 1.5, 1],
              rotate: [-20, 20, -20, 20, 0],
            }}
            transition={{ duration: 1.5 + (window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296), ease: "easeOut" }} // NOSONAR: Safe — visual particle duration variation, not security-sensitive.
            style={{ position: "absolute" }}
          >
            <span style={{ fontSize: "25px" }}>
              {emojis[Math.floor((globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * emojis.length)]}{" "}
              {/* NOSONAR: Safe — visual emoji variation, not security-sensitive. */}
            </span>
          </motion.div>
        );
      })}
    </Box>
  );
};

interface IElliotSearchDialogProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  setSessions: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveSessionId: (id: string) => void;
}

const ElliotSearchDialog: React.FC<IElliotSearchDialogProps> = React.memo(({
  className = "elliot-search-dialog-container",
  open,
  onClose,
  setSessions,
  setActiveSessionId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await api.get(`/api/ai/chat/search?search_term=${encodeURIComponent(searchQuery)}`);
        if (response.data && (response.data.status || response.data.success)) {
          const recent = response.data.data?.recent || [];
          const archived = response.data.data?.archived || [];
          setSearchResults([...recent, ...archived]);
        }
      } catch (error) {
        console.error("Error searching chats:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      className={className}
      PaperProps={{
        className: "elliot-search-dialog-paper",
        sx: {
          borderRadius: "16px",
          m: 2,
          alignSelf: "flex-start",
          mt: 10,
          outline: "none !important",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15) !important",
          border: "1px solid #e5e7eb !important",
          "&:focus": { outline: "none !important", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15) !important" },
          "&:focus-within": { outline: "none !important", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15) !important" },
          "&:focus-visible": { outline: "none !important", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15) !important" },
        },
      }}
    >
      <Box
        className="elliot-search-dialog-header"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
          outline: "none !important",
          boxShadow: "none !important",
          "&:focus": { outline: "none !important", boxShadow: "none !important" },
          "&:focus-within": { outline: "none !important", boxShadow: "none !important" },
          "&:focus-visible": { outline: "none !important", boxShadow: "none !important" },
        }}
      >
        <SearchIcon sx={{ color: "#9ca3af", mr: 1.5 }} />
        <input
          autoFocus
          className="elliot-search-input"
          placeholder="Search in chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            boxShadow: "none",
            fontSize: "16px",
            padding: "4px 4px",
            background: "transparent",
            color: "#111827",
          }}
        />
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            outline: "none !important",
            boxShadow: "none !important",
            "&:focus": { outline: "none !important", boxShadow: "none !important" },
            "&:focus-visible": { outline: "none !important", boxShadow: "none !important" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: "400px", overflowY: "auto", p: 1 }} className="elliot-search-dialog-content">
        {searchQuery.trim() === "" ? (
          <Typography
            variant="body2"
            sx={{ p: 2, textAlign: "center", color: "#6b7280" }}
            className="elliot-search-placeholder-text"
          >
            Type to search for messages or chat titles
          </Typography>
        ) : searchLoading ? ( // NOSONAR
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }} className="elliot-search-loading-container">
            <CircularProgress size={24} className="elliot-search-loader" />
          </Box>
        ) : (
          searchResults.map((session, index, arr) => {
            const matchMsg = session.target_chat;
            return (
              <Box
                key={session.session_id}
                onClick={() => {
                  setSessions(prev => {
                    if (!prev.some(s => s.id === session.session_id)) { // NOSONAR
                      return [...prev, {
                        id: session.session_id,
                        title: session.title,
                        isPinned: session.is_pinned,
                        isArchived: session.is_archived,
                        history: []
                      }];
                    }
                    return prev;
                  });
                  setActiveSessionId(session.session_id);
                  handleClose();
                }}
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  mb: index === arr.length - 1 ? 0 : 0.5,
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
                className="elliot-search-result-item"
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#111827", mb: 0.5 }}
                  className="elliot-search-result-title"
                >
                  {session.title}
                </Typography>
                {matchMsg && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    className="elliot-search-result-snippet"
                  >
                    <strong style={{ color: "#374151" }} className="elliot-search-match-label">
                      Match:
                    </strong>{" "}
                    {matchMsg.user_input && matchMsg.user_input.toLowerCase().includes(searchQuery.toLowerCase()) // NOSONAR
                      ? `You: ${matchMsg.user_input}`
                      : `Elliot: ${matchMsg.ai_output}`}
                  </Typography>
                )}
              </Box>
            );
          })
        )}
        {searchQuery.trim() !== "" && !searchLoading && searchResults.length === 0 && (
          <Typography
            variant="body2"
            sx={{ p: 2, textAlign: "center", color: "#6b7280" }}
            className="elliot-search-no-results"
          >
            No chats found matching "{searchQuery}"
          </Typography>
        )}
      </Box>
    </Dialog>
  );
});

interface IElliotFooterFormProps {
  className?: string;
  methods: any;
  onSubmit: any;
  formRef: React.RefObject<HTMLFormElement>;
  isListeningToInput: boolean;
  stopInputSpeech: () => void;
  quotedText: string;
  setQuotedText: React.Dispatch<React.SetStateAction<string>>;
  attachedFiles: File[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selectedScreens: string[];
  setSelectedScreens: React.Dispatch<React.SetStateAction<string[]>>;
  selectedExams: string[];
  setSelectedExams: React.Dispatch<React.SetStateAction<string[]>>;
  SCREENS: string[];
  EXAMS: string[];
  inputRef: React.RefObject<HTMLInputElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedAgent: string;
  setSelectedAgent: React.Dispatch<React.SetStateAction<string>>;
  dbAgents: any[];
  handleToggleInputListening: () => void;
  isLoadingActive: boolean;
  handleOpenVoicePanel: () => void;
}

const ElliotFooterForm: React.FC<IElliotFooterFormProps> = React.memo(({
  className = "elliot-footer-form-container",
  methods,
  onSubmit,
  formRef,
  isListeningToInput,
  stopInputSpeech,
  quotedText,
  setQuotedText,
  attachedFiles,
  setAttachedFiles,
  selectedScreens,
  setSelectedScreens,
  selectedExams,
  setSelectedExams,
  SCREENS,
  EXAMS,
  inputRef,
  fileInputRef,
  selectedAgent,
  setSelectedAgent,
  dbAgents,
  handleToggleInputListening,
  isLoadingActive,
  handleOpenVoicePanel,
}) => {
  const messageText = useWatch({ control: methods.control, name: "message" }) || "";

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSearch, setSlashSearch] = useState("");
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);

  const [showAtMenu, setShowAtMenu] = useState(false);
  const [atSearch, setAtSearch] = useState("");
  const [atMenuIndex, setAtMenuIndex] = useState(0);

  useEffect(() => {
    const text = messageText || "";

    // Slash Menu matching
    const slashMatch = /(?:^|\s)\/([a-zA-Z]*)$/.exec(text);
    if (slashMatch) {
      setShowSlashMenu(true);
      setSlashSearch(slashMatch[1].toLowerCase());
      setSlashMenuIndex(0);
      setShowAtMenu(false);
      return;
    } else {
      setShowSlashMenu(false);
    }

    // At Menu matching
    const atMatch = /(?:^|\s)@(\w*)$/.exec(text);
    if (atMatch) {
      setShowAtMenu(true);
      setAtSearch(atMatch[1].toLowerCase());
      setAtMenuIndex(0);
    } else {
      setShowAtMenu(false);
    }
  }, [messageText]);

  const handleSelectScreen = (screenName: string) => {
    const text = methods.getValues("message") || "";
    const newText = text.replace(/(^|\s)\/[a-zA-Z]*$/, `$1`);
    methods.setValue("message", newText, { shouldValidate: true, shouldDirty: true });
    setSelectedScreens(prev => prev.includes(screenName) ? prev : [...prev, screenName]);
    setShowSlashMenu(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSelectExam = (examName: string) => {
    const text = methods.getValues("message") || "";
    const newText = text.replace(/(^|\s)@(\w*)$/, `$1`);
    methods.setValue("message", newText, { shouldValidate: true, shouldDirty: true });
    setSelectedExams(prev => prev.includes(examName) ? prev : [...prev, examName]);
    setShowAtMenu(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const showSend = !!(messageText.trim() || attachedFiles.length > 0 || isLoadingActive);

  return (
    <Box className={className} sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          ref={formRef}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
            backgroundColor: isListeningToInput ? "#ffffff" : "#f3f4f6",
            borderRadius: "30px",
            padding: isListeningToInput ? "8px 16px" : "10px 14px",
            boxShadow: isListeningToInput ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "inset 0 1px 2px rgba(0,0,0,0.05)",
            border: isListeningToInput ? "1px solid #1976d2" : "1px solid #cbd5e1",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          {isListeningToInput ? (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '40px', gap: 2, px: 1 }}>
              <IconButton size="small" onClick={stopInputSpeech} sx={{ color: '#6b7280', '&:hover': { color: '#111827' } }}>
                <AddIcon fontSize="small" />
              </IconButton>

              {/* Waveform Area */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px', height: '100%' }}>
                <Box sx={{ flex: 1, borderBottom: '2px dotted #d1d5db', mr: 2, height: '2px' }} />
                {Array.from({ length: 40 }).map((_, i) => (
                  <Box
                    key={i} // NOSONAR
                    component={motion.div}
                    animate={{ height: [6, 12 + (globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * 18, 6] }}
                    transition={{ duration: 0.25 + (globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    sx={{ width: '2px', backgroundColor: '#4b5563', borderRadius: '1px' }}
                  />
                ))}
              </Box>

              {/* Right Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton size="small" onClick={stopInputSpeech} sx={{ color: '#6b7280', '&:hover': { color: '#ef4444' } }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => { stopInputSpeech(); formRef.current?.requestSubmit(); }} sx={{ color: '#111827', backgroundColor: '#e5e7eb', '&:hover': { backgroundColor: '#d1d5db' } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </IconButton>
              </Box>
            </Box>
          ) : (
            <>
              {/* Quoted Text Area */}
              {quotedText && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.04)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    mb: 1,
                    borderLeft: "3px solid #009dff",
                  }}
                >
                  <FormatQuoteIcon
                    sx={{ fontSize: "16px", color: "#6b7280", mr: 1 }}
                  />
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: "13px",
                      color: "#333",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {quotedText}
                  </Typography>
                  <IconButtonField
                    size="small"
                    onClick={() => setQuotedText("")}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: "16px" }} />
                  </IconButtonField>
                </Box>
              )}
              {/* Attached Files Area */}
              {attachedFiles.length > 0 && (
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}
                >
                  {attachedFiles.map((file, idx) => {
                    const isImg = file.type.startsWith("image/");
                    const isVid = file.type.startsWith("video/");
                    const isAud = file.type.startsWith("audio/");
                    return (
                      <Box
                        key={idx} // NOSONAR
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "rgba(0,157,255,0.1)",
                          padding: "4px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {isImg && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{
                              width: "24px",
                              height: "24px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginRight: "6px",
                            }}
                          />
                        )}
                        {isVid && (
                          <video
                            src={URL.createObjectURL(file)}
                            style={{
                              width: "24px",
                              height: "24px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginRight: "6px",
                            }}
                          >
                            <track kind="captions" />
                          </video>
                        )}
                        {isAud && (
                          <VolumeUpIcon
                            sx={{
                              fontSize: "20px",
                              color: "#0055b3",
                              marginRight: "4px",
                            }}
                          />
                        )}
                        {!isImg &&
                          !isVid &&
                          !isAud &&
                          getFileIcon(file.name, {
                            fontSize: "16px",
                            color: "#0055b3",
                            marginRight: "4px",
                          })}
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#0055b3",
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <IconButtonField
                          size="small"
                          onClick={() =>
                            setAttachedFiles((prev) =>
                              prev.filter((_, i) => i !== idx), // NOSONAR
                            )
                          }
                          sx={{ p: 0.2, ml: 0.5 }}
                        >
                          <CloseIcon
                            sx={{ fontSize: "14px", color: "#0055b3" }}
                          />
                        </IconButtonField>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {/* Selected Screens Area */}
              {selectedScreens.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {selectedScreens.map((screen, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(236,72,153,0.1)', padding: '4px 10px', borderRadius: '16px', border: '1px solid rgba(236,72,153,0.2)' }} /* NOSONAR */>
                      <Typography sx={{ fontSize: '12px', color: '#ec4899', fontWeight: 600 }}>
                        {screen}
                      </Typography>
                      <IconButtonField size="small" onClick={() => setSelectedScreens(prev => prev.filter((_, i) => i !== idx))} sx={{ p: 0.2, ml: 0.5 }}/* NOSONAR */ >
                        <CloseIcon sx={{ fontSize: '14px', color: '#ec4899' }} />
                      </IconButtonField>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Selected Exams Area */}
              {selectedExams.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {selectedExams.map((exam, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '4px 10px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }} /* NOSONAR */>
                      <Typography sx={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 600 }}>
                        {exam}
                      </Typography>
                      <IconButtonField size="small" onClick={() => setSelectedExams(prev => prev.filter((_, i) => i !== idx))} sx={{ p: 0.2, ml: 0.5 }}/* NOSONAR */ >
                        <CloseIcon sx={{ fontSize: '14px', color: '#8b5cf6' }} />
                      </IconButtonField>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Slash Menu */}
              {showSlashMenu && (
                <Box sx={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '16px',
                  marginBottom: '8px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  zIndex: 1000,
                  width: '240px',
                  maxHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                  "&::-webkit-scrollbar-thumb": { backgroundColor: "#d1d5db", borderRadius: "10px" }
                }}>
                  {SCREENS.filter(s => s.toLowerCase().includes(slashSearch)).map((screen, idx) => (
                    <Box
                      key={screen}
                      onClick={() => handleSelectScreen(screen)}
                      sx={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: idx === slashMenuIndex ? '#f3f4f6' : 'transparent',
                        '&:hover': { backgroundColor: '#f9fafb' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <span style={{ color: '#009dff', fontWeight: 'bold' }}>/</span>
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        {screen}
                      </Typography>
                    </Box>
                  ))}
                  {SCREENS.filter(s => s.toLowerCase().includes(slashSearch)).length === 0 && (
                    <Typography variant="body2" sx={{ padding: '12px 16px', color: '#9ca3af', textAlign: 'center' }}>No screens found</Typography>
                  )}
                </Box>
              )}

              {/* @ Menu for Exams */}
              {showAtMenu && (
                <Box sx={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '16px',
                  marginBottom: '8px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  zIndex: 1000,
                  width: '240px',
                  maxHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                  "&::-webkit-scrollbar-thumb": { backgroundColor: "#d1d5db", borderRadius: "10px" }
                }}>
                  {EXAMS.filter(e => e.toLowerCase().includes(atSearch)).map((exam, idx) => (
                    <Box
                      key={exam}
                      onClick={() => handleSelectExam(exam)}
                      sx={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: idx === atMenuIndex ? '#f3f4f6' : 'transparent',
                        '&:hover': { backgroundColor: '#f9fafb' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>@</span>
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        {exam}
                      </Typography>
                    </Box>
                  ))}
                  {EXAMS.filter(e => e.toLowerCase().includes(atSearch)).length === 0 && (
                    <Typography variant="body2" sx={{ padding: '12px 16px', color: '#9ca3af', textAlign: 'center' }}>No exams found</Typography>
                  )}
                </Box>
              )}

              {/* Input area */}
              <Box sx={{ width: "100%", display: "flex" }}>
                <TextInputFieldC
                  name="message"
                  type="text"
                  placeholder="Describe your Doubt"
                  size="small"
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={5}
                  onKeyDown={(e) => { // NOSONAR
                    if (showSlashMenu) {
                      const filtered = SCREENS.filter(s => s.toLowerCase().includes(slashSearch));
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSlashMenuIndex(prev => (prev + 1) % (filtered.length || 1));
                        return;
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSlashMenuIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
                        return;
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (filtered[slashMenuIndex]) {
                          handleSelectScreen(filtered[slashMenuIndex]);
                        }
                        return;
                      } else if (e.key === "Escape") {
                        setShowSlashMenu(false);
                        return;
                      }
                    }

                    if (showAtMenu) {
                      const filtered = EXAMS.filter(e => e.toLowerCase().includes(atSearch));
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setAtMenuIndex(prev => (prev + 1) % (filtered.length || 1));
                        return;
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setAtMenuIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
                        return;
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (filtered[atMenuIndex]) {
                          handleSelectExam(filtered[atMenuIndex]);
                        }
                        return;
                      } else if (e.key === "Escape") {
                        setShowAtMenu(false);
                        return;
                      }
                    }

                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const currentVal = methods.getValues("message") || "";
                      if (
                        !isLoadingActive &&
                        (currentVal.trim() || attachedFiles.length > 0)
                      ) {
                        formRef.current?.requestSubmit();
                      }
                    }
                  }}
                  inputRef={inputRef}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      border: "none",
                      backgroundColor: "transparent",
                      fontSize: "15px",
                      width: "100%",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      p: 0,
                    },
                  }}
                />
              </Box>

              {/* Bottom Row Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1.5,
                }}
              >
                {/* Left Side: Plus, Image, Auto Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title="Attach file">
                    <IconButtonField
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        color: "#6b7280",
                        p: 0.5,
                        "&:hover": { color: "#111827" },
                      }}
                    >
                      <AttachFileIcon fontSize="small" />
                    </IconButtonField>
                  </Tooltip>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachedFiles((prev) => [
                          ...prev,
                          ...Array.from(e.target.files!),
                        ]);
                      }
                    }}
                  />

                  {/* Auto Agent Selection dropdown/button */}
                  <FormControl size="small" sx={{ m: 0, minWidth: 100 }}>
                    <Select
                      value={selectedAgent}
                      onChange={(e) =>
                        setSelectedAgent(e.target.value /* NOSONAR */)
                      }
                      displayEmpty
                      MenuProps={{
                        anchorEl: formRef.current,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                        transformOrigin: {
                          vertical: "bottom",
                          horizontal: "center",
                        },
                        PaperProps: {
                          className: "elliot-agent-select-paper",
                          sx: {
                            width: "320px",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                            border: "1px solid #e5e7eb",
                            p: 1,
                            mb: 1,
                            "& .MuiMenuItem-root": {
                              borderRadius: "6px",
                              py: 1,
                              px: 2,
                              fontWeight: 500,
                              justifyContent: "center",
                            }
                          }
                        }
                      }}
                      sx={{
                        height: "30px",
                        borderRadius: "15px",
                        fontSize: "13px",
                        fontWeight: 600,
                        backgroundColor: "rgba(0,0,0,0.04)",
                        border: "none !important",
                        boxShadow: "none !important",
                        outline: "none !important",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none !important",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none !important",
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none !important",
                        },
                        "&:focus": {
                          outline: "none !important",
                          boxShadow: "none !important",
                        },
                        "&:focus-within": {
                          outline: "none !important",
                          boxShadow: "none !important",
                        },
                        "&:active": {
                          outline: "none !important",
                          boxShadow: "none !important",
                        },
                        "& .MuiSelect-select": {
                          py: 0.5,
                          pl: 2,
                          pr: 3,
                          display: "flex",
                          alignItems: "center",
                          outline: "none !important",
                          boxShadow: "none !important",
                          "&:focus": {
                            outline: "none !important",
                          }
                        },
                      }}
                    >
                      <MenuItem value="General Assistant" className="elliot-agent-select-item-auto">Auto</MenuItem>
                      {dbAgents.map((agent) => (
                        <MenuItem key={agent.id} value={agent.agent_name} className="elliot-agent-select-item">
                          {agent.agent_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Right Side: Magic Wand (Agent indicator), Mic (STT), Wave (Voice Panel) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip
                    title={
                      isListeningToInput
                        ? "Listening... Click to stop"
                        : "Voice input (STT)"
                    }
                  >
                    <IconButtonField
                      onClick={handleToggleInputListening}
                      sx={{
                        color: isListeningToInput ? "#f44336" : "#6b7280",
                        p: 0.5,
                        "&:hover": {
                          color: isListeningToInput ? "#ef4444" : "#111827",
                        },
                      }}
                    >
                      {isListeningToInput ? (
                        <MicIcon fontSize="medium" />
                      ) : (
                        <MicNoneIcon fontSize="medium" />
                      )}
                    </IconButtonField>
                  </Tooltip>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Voice Mode button */}
                    <Box
                      sx={{
                        width: !showSend ? "32px" : "0px", // NOSONAR
                        opacity: !showSend ? 1 : 0, // NOSONAR
                        transform: !showSend ? "scale(1)" : "scale(0.8)", // NOSONAR
                        pointerEvents: !showSend ? "auto" : "none", // NOSONAR
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Voice Mode">
                        <IconButtonField
                          onClick={handleOpenVoicePanel}
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: "#fff",
                            color: "#111827",
                            borderRadius: "50%",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            border: "1px solid #e5e5e5",
                            p: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": {
                              backgroundColor: "#f9fafb",
                            },
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="4" y1="9" x2="4" y2="15" />
                            <line x1="9" y1="6" x2="9" y2="18" />
                            <line x1="14" y1="4" x2="14" y2="20" />
                            <line x1="19" y1="8" x2="19" y2="16" />
                          </svg>
                        </IconButtonField>
                      </Tooltip>
                    </Box>

                    {/* Send button */}
                    <Box
                      sx={{
                        width: showSend ? "32px" : "0px",
                        opacity: showSend ? 1 : 0,
                        transform: showSend ? "scale(1)" : "scale(0.8)",
                        pointerEvents: showSend ? "auto" : "none",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: showSend ? 1 : 0,
                      }}
                    >
                      <IconButtonField
                        disabled={
                          (!messageText.trim() && attachedFiles.length === 0) ||
                          isLoadingActive
                        }
                        onClick={() => {
                          const currentVal = methods.getValues("message") || "";
                          if (
                            !isLoadingActive &&
                            (currentVal.trim() || attachedFiles.length > 0)
                          )
                            formRef.current?.requestSubmit();
                        }}
                        sx={{
                          backgroundColor:
                            (!messageText.trim() && attachedFiles.length === 0) ||
                              isLoadingActive
                              ? "#e5e7eb"
                              : "#009dff",
                          color:
                            (!messageText.trim() && attachedFiles.length === 0) ||
                              isLoadingActive
                              ? "#9ca3af"
                              : "#fff",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          p: 0,
                          minWidth: "unset",
                          cursor:
                            (!messageText.trim() && attachedFiles.length === 0) ||
                              isLoadingActive
                              ? "default"
                              : "pointer",
                          "&:hover": {
                            backgroundColor:
                              (!messageText.trim() &&
                                attachedFiles.length === 0) ||
                                isLoadingActive
                                ? "#e5e7eb"
                                : "#1666c1",
                          },
                        }}
                      >
                        <img
                          src={sendImage}
                          alt="Send"
                          style={{
                            width: 14,
                            height: 14,
                            opacity:
                              !messageText.trim() || isLoadingActive ? 0.4 : 1,
                          }}
                        />
                      </IconButtonField>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </form>
      </FormProvider>
    </Box>
  );
});

const ChatbotElliot: FunctionComponent = () => { // NOSONAR
  const dispatch = useAppDispatch();
  const { data: chatbotData, isLoading: chatloading } = useAppSelector(
    (state) => state.ChatWithElliotSlicer,
  );
  const navigate = useNavigate(); // NOSONAR

  // Agent Selection State
  const [selectedAgent, setSelectedAgent] =
    useState<string>("General Assistant");
  const [dbAgents, setDbAgents] = useState<any[]>([]);
  const [speedUpIndex, setSpeedUpIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const typesResponse = await api.get("/api/admin-dashboard/agent-types");
        if (typesResponse.data && (typesResponse.data.status || typesResponse.data.success)) {
          const types = typesResponse.data.data || [];
          const assistantType = types.find(
            (t: any) =>
              t.meta_value.toLowerCase() === "assistant" ||
              t.meta_value.toLowerCase() === "assisstant"
          );
          if (assistantType) {
            const agentsResponse = await api.get(
              `/api/admin-dashboard/agents?agent_type_id=${assistantType.id}`
            );
            if (agentsResponse.data && (agentsResponse.data.status || agentsResponse.data.success)) {
              setDbAgents(agentsResponse.data.data || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic agents:", error);
      }
    };
    fetchAgents();
  }, []);

  // Copy to clipboard State
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyMessage = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Text Quote State
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [quotedText, setQuotedText] = useState<string>("");

  const remarkPluginsList = useMemo<any>(() => [remarkMath, remarkGfm], []);
  const rehypePluginsList = useMemo<any>(() => [rehypeKatex], []);

  const markdownComponents = useMemo(() => ({
    p: ({ children }: any) => <p style={{ margin: "0 0 8px 0" }}>{children}</p>, // NOSONAR
    ul: ({ children }: any) => <ul style={{ margin: "8px 0", paddingLeft: "24px" }}>{children}</ul>, // NOSONAR
    ol: ({ children }: any) => <ol style={{ margin: "8px 0", paddingLeft: "24px" }}>{children}</ol>, // NOSONAR
    li: ({ children }: any) => <li style={{ marginBottom: "4px" }}>{children}</li>, // NOSONAR
    strong: ({ children }: any) => <strong style={{ fontWeight: "bold" }}>{children}</strong>, // NOSONAR
    table: ({ children }: any) => ( // NOSONAR
      <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", backgroundColor: "#fff" }}>{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>{children}</thead>, // NOSONAR
    tbody: ({ children }: any) => <tbody>{children}</tbody>, // NOSONAR
    tr: ({ children }: any) => <tr style={{ borderBottom: "1px solid #e5e7eb", transition: "background-color 0.2s" }}>{children}</tr>, // NOSONAR
    th: ({ children }: any) => <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>{children}</th>, // NOSONAR
    td: ({ children }: any) => <td style={{ padding: "12px 16px", color: "#4b5563" }}>{children}</td>, // NOSONAR
    code: (props: any) => { // NOSONAR
      const { children, className } = props;
      const match = /language-(\w+)/.exec(className || "");
      if (match && match[1] === "echarts") { // NOSONAR
        try {
          const rawCode = String(children).replace(/`:::cursor:::`/g, "").replace(/:::cursor:::/g, "").trim(); // NOSONAR
          const getOptions = new Function(`return ${rawCode}`); // nosemgrep: eslint.detect-eval-with-expression // NOSONAR
          const options = getOptions();
          return (
            <div style={{ width: '100%', minWidth: 'min(650px, 80vw)', height: '400px', margin: '16px 0', backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />
            </div>
          );
        } catch (e) { // NOSONAR
          return <pre style={{ opacity: 0.7 }}><code className={className}>{children}</code></pre>;
        }
      }

      if (match && match[1] === "html") { // NOSONAR
        const rawHTML = String(children).replace(/`:::cursor:::`/g, "").replace(/:::cursor:::/g, "").trim(); // NOSONAR
        if (rawHTML.startsWith("<table") || rawHTML.startsWith("<div")) {
          return (
            <div
              style={{ overflowX: "auto", margin: "16px 0", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "8px", backgroundColor: "#fff" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawHTML) }} // nosemgrep: eslint.react-dangerouslysetinnerhtml
            />
          );
        }
      }

      if (match && match[1] === "mathwidget") { // NOSONAR
        const rawCode = String(children).replace(/`:::cursor:::`/g, "").replace(/:::cursor:::/g, "").trim(); // NOSONAR
        try {
          const getOptions = new Function(`return ${rawCode}`); // nosemgrep: eslint.detect-eval-with-expression // NOSONAR - Intentionally evaluating LLM output
          const config = getOptions();
          return <MathWidget config={config} />;
        } catch (e) { // NOSONAR
          return <pre style={{ opacity: 0.7 }}><code className={className}>{children}</code></pre>;
        }
      }
      return <code className={className}>{children}</code>;
    },
  }), []);

  // Speech-to-Text (STT) for main chat input
  const [isListeningToInput, setIsListeningToInput] = useState(false);
    const inputRecognitionRef = useRef<any>(null);

    // Text-to-Speech (TTS) State
    const [isPlayingTTS, setIsPlayingTTS] = useState(false);
    const [isPausedTTS, setIsPausedTTS] = useState(false);
    const [activeTTSIndex, setActiveTTSIndex] = useState<number | null>(null);
    const [autoPlayTTS] = useState<boolean>(true);
    const [speechRate, setSpeechRate] = useState<number>(1);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Voice Chat Panel (Modal) State
    const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
    const [voicePanelState, setVoicePanelState] = useState<
      "listening" | "processing" | "speaking" | "interrupted"
    >("listening");
    const [voiceMuted, setVoiceMuted] = useState(false);
    const [, setVoiceTimer] = useState(0); // NOSONAR
    const [voiceTranscript, setVoiceTranscript] = useState("");
    const [botSpeakingText, setBotSpeakingText] = useState("");
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const voiceTimerRef = useRef<any>(null);
    const voiceRecognitionRef = useRef<any>(null);
    const silenceTimeoutRef = useRef<any>(null);

    // Barge-In / Interrupt Support State & Refs
    const [bargeInThreshold, setBargeInThreshold] = useState<number>(150);
    const bargeInThresholdRef = useRef<number>(150);
    const [spokenCharIndex, setSpokenCharIndex] = useState<number>(-1);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneStreamRef = useRef<MediaStream | null>(null);
    const audioIntervalRef = useRef<any>(null);
    const voicePanelStateRef = useRef<
      "listening" | "processing" | "speaking" | "interrupted"
    >("listening");
    const isVoicePanelOpenRef = useRef<boolean>(false);
    const voiceMutedRef = useRef<boolean>(false);
    // Synchronous flag: controls whether SpeechRecognition should auto-restart in onend
    const shouldListenRef = useRef<boolean>(false);
    // Session ID: prevents stale onend callbacks from restarting recognition
    const recognitionSessionIdRef = useRef<number>(0);
    // Prevents duplicate voice submissions racing each other
    const isSubmittingRef = useRef<boolean>(false);
    const [showMuteTooltip, setShowMuteTooltip] = useState<boolean>(false); // NOSONAR

    useEffect(() => {
      if (!chatloading) {
        isSubmittingRef.current = false;
      }
    }, [chatloading]);

    useEffect(() => {
      voicePanelStateRef.current = voicePanelState;
    }, [voicePanelState]);

    useEffect(() => {
      let showTimeout: NodeJS.Timeout;
      let hideTimeout: NodeJS.Timeout;

      const runRoutine = () => {
        showTimeout = setTimeout(() => {
          setShowMuteTooltip(true);
          hideTimeout = setTimeout(() => { // NOSONAR
            setShowMuteTooltip(false);
            runRoutine();
          }, 4000);
        }, 3000);
      };

      if (voiceMuted && isVoicePanelOpen) {
        runRoutine();
      } else {
        setShowMuteTooltip(false);
      }

      return () => {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
      };
    }, [voiceMuted, isVoicePanelOpen]);

    useEffect(() => {
      isVoicePanelOpenRef.current = isVoicePanelOpen;
    }, [isVoicePanelOpen]);

    useEffect(() => {
      voiceMutedRef.current = voiceMuted;
    }, [voiceMuted]);

    // Local Loading State for Mock Agents
    const [localLoading, setLocalLoading] = useState(false);
    const isLoadingActive = chatloading || localLoading;

    // Scroll to bottom State
    const [showScrollBottom, setShowScrollBottom] = useState(false);

    // Search Chat Modal State
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Chat Menu State
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const [activeMenuSessionId, setActiveMenuSessionId] = useState<string | null>(
      null,
    );
    const [renameSessionId, setRenameSessionId] = useState<string | null>(null);
    const [renameTitle, setRenameTitle] = useState("");
    const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
    const [isRecentExpanded, setIsRecentExpanded] = useState(true); // NOSONAR
    const [isArchivedExpanded, setIsArchivedExpanded] = useState(false); // NOSONAR
    const [speedPopoverAnchor, setSpeedPopoverAnchor] = useState<HTMLDivElement | null>(null);
    const [voicePopoverAnchor, setVoicePopoverAnchor] = useState<HTMLDivElement | null>(null);

    const applicationName =
      globalThis.location.hostname.toLowerCase().includes("ucat") ||
        globalThis.location.hostname.toLowerCase().includes("ucattest") ||
        globalThis.location.hostname.split(".")[0]?.includes("192")
        ? "ucat"
        : "gate";

    const divRef = useRef<HTMLDivElement>(null);

    const methods = useForm<IChatbotPublic>({
      defaultValues: {
        message: "",
      },
    });
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [feedbacks, setFeedbacks] = useState<{
      [key: string]: "helpful" | "not_helpful" | null;
    }>({});
    const [feedbackAnim, setFeedbackAnim] = useState<{
      type: "helpful" | "not_helpful";
      id: string;
      x: number;
      y: number;
    } | null>(null);

    useEffect(() => {
      const handleSelectionEnd = () => {
        setTimeout(() => {
          const selection = globalThis.getSelection();
          if (
            selection &&
            selection.toString().trim().length > 0 &&
            divRef.current?.contains(selection.anchorNode)
          ) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectionRect(rect);
            setSelectedText(selection.toString().trim());
          } else {
            setSelectionRect(null);
            setSelectedText("");
          }
        }, 50);
      };

      // Use mouseup and keyup instead of selectionchange to avoid interrupting the user's drag selection
      document.addEventListener("mouseup", handleSelectionEnd);
      document.addEventListener("keyup", handleSelectionEnd);
      return () => {
        document.removeEventListener("mouseup", handleSelectionEnd);
        document.removeEventListener("keyup", handleSelectionEnd);
      };
    }, []);

    const handleFeedback = (
      e: React.MouseEvent,
      key: string | number,
      type: "helpful" | "not_helpful",
    ) => {
      const isTogglingOff = feedbacks[key] === type;
      const botMessage = chatHistory[Number(key)];
      const chunkId = botMessage?.conversation_chunk_id;

      if (!isTogglingOff) { // NOSONAR
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setFeedbackAnim({
          type,
          id: Date.now().toString(),
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }); // NOSONAR: Safe — ephemeral visual feedback animation ID, not security-sensitive.
        setTimeout(() => setFeedbackAnim(null), 2500);

        const agentName = applicationName === "ucat" ? "UCATchat" : "chat";
        api
          .post("/api/admin-dashboard/prompts/feedback", {
            agent_name: agentName,
            feedback_type: type,
            conversation_chunk_id: chunkId || null,
          })
          .catch((err: any) => {
            console.error("Error saving feedback:", err);
          });
      } else {
        const agentName = applicationName === "ucat" ? "UCATchat" : "chat";
        api
          .post("/api/admin-dashboard/prompts/feedback", {
            agent_name: agentName,
            feedback_type: "remove",
            conversation_chunk_id: chunkId || null,
          })
          .catch((err: any) => {
            console.error("Error removing feedback:", err);
          });
      }

      setFeedbacks((prev) => {
        if (prev[key] === type) {
          // Toggle off
          const newFeedbacks = { ...prev };
          delete newFeedbacks[key];
          return newFeedbacks;
        }
        return { ...prev, [key]: type };
      });
    };

    type ChatHistoryItem = {
      sender: "user" | "bot";
      message: string;
      alreadyTyped?: boolean;
      quotedText?: string;
      attachments?: {
        name: string;
        url: string;
        isImage: boolean;
        isVideo?: boolean;
        isAudio?: boolean;
      }[];
      screens?: string[];
      exams?: string[];
      conversation_chunk_id?: number | string;
    };
    type ChatHistoryUpdater =
      | ChatHistoryItem[]
      | ((prev: ChatHistoryItem[]) => ChatHistoryItem[]);

    interface ChatSession {
      id: string;
      title: string;
      history: ChatHistoryItem[];
      isPinned?: boolean;
      isArchived?: boolean;
    }

    const [sessions, setSessions] = useState<ChatSession[]>(() => {
      const saved = localStorage.getItem("chat_with_elliot_sessions");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
      return [{ id: "default", title: "New Chat", history: [] }];
    });

    const [activeSessionId, setActiveSessionId] = useState<string>("default");

    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/ai/chat/history");
        if (response.data && (response.data.status || response.data.success)) {
          const recent = response.data.data?.recent || [];
          const archived = response.data.data?.archived || [];
          const combined: ChatSession[] = [
            ...recent.map((s: any) => ({
              id: s.session_id,
              title: s.title,
              isPinned: s.is_pinned,
              isArchived: s.is_archived,
              history: s.history || []
            })),
            ...archived.map((s: any) => ({
              id: s.session_id,
              title: s.title,
              isPinned: s.is_pinned,
              isArchived: s.is_archived,
              history: s.history || []
            }))
          ];
          setSessions((prev) => {
            const defaultSess = prev.find(s => s.id === "default") || { id: "default", title: "New Chat", history: [] };
            const combinedWithHistory = combined.map(newSess => {
              const existingSess = prev.find(oldSess => oldSess.id === newSess.id); // NOSONAR
              return {
                ...newSess,
                history: existingSess && existingSess.history.length > 0 ? existingSess.history : newSess.history
              };
            });
            if (activeSessionId === "default") {
              return [defaultSess, ...combinedWithHistory.filter(s => s.id !== "default")];
            }
            return combinedWithHistory;
          });
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    const fetchSessionMessages = async (sessionId: string, typeLastMessage = false) => {
      if (sessionId === "default") {
        setChatHistory([]);
        return;
      }
      setLocalLoading(true);
      try {
        const response = await api.get(`/api/ai/chat/history/${sessionId}`);
        if (response.data && (response.data.status || response.data.success)) {
          const messages = response.data.data || [];
          const mappedMessages: ChatHistoryItem[] = [];
          messages.forEach((msg: any, idx: number) => {
            mappedMessages.push({
              sender: "user",
              message: msg.user_input,
              alreadyTyped: true
            });
            const isLast = idx === messages.length - 1;
            mappedMessages.push({
              sender: "bot",
              message: msg.ai_output,
              alreadyTyped: typeLastMessage && isLast ? false : true, // NOSONAR
              conversation_chunk_id: msg.id
            });
          });
          setSessions(prev => {
            const existing = prev.find(s => s.id === sessionId);
            if (!existing) {
              return [{ id: sessionId, title: "Chat", history: mappedMessages }, ...prev];
            }
            return prev.map(s => s.id === sessionId ? { ...s, history: mappedMessages } : s);
          });

          const newFeedbacks: { [key: string]: "helpful" | "not_helpful" | null } = {};
          mappedMessages.forEach((msg, idx) => {
            if (msg.sender === "bot" && msg.conversation_chunk_id) {
              const backendMsg = messages.find((m: any) => m.id === msg.conversation_chunk_id);
              if (backendMsg?.feedback) {
                newFeedbacks[idx] = backendMsg.feedback as "helpful" | "not_helpful";
              }
            }
          });
          setFeedbacks(newFeedbacks);
        }
      } catch (error) {
        console.error("Error fetching session messages:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    useEffect(() => {
      dispatch(clearChatbotPublicStatus());
      dispatch(clearChatWithElliotStatus());
      fetchSessions();
    }, []);

    useEffect(() => {
      fetchSessionMessages(activeSessionId);
    }, [activeSessionId]);

    const initialGreeting = useMemo(() => {
      const greetings = [
        "Where should we begin?",
        "How can I help you today?",
        "What would you like to explore?",
        "Ready to learn something new?",
      ];
      return greetings[Math.floor((globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * greetings.length)]; // NOSONAR: Safe — greeting message randomization, not security-sensitive.
    }, [activeSessionId]);

    const randomSuggestions = useMemo(() => {
      const suggestionsList = [
        { label: "Show my progress", icon: <TrendingUpIcon fontSize="small" /> },
        {
          label: "Practice recommendations",
          icon: <MenuBookIcon fontSize="small" />,
        },
        { label: "Study tips", icon: <LightbulbIcon fontSize="small" /> },
        { label: "Create a quiz", icon: <QuizIcon fontSize="small" /> },
        { label: "Explain a concept", icon: <SchoolIcon fontSize="small" /> },
      ];
      return [...suggestionsList].sort(() => 0.5 - (globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296)).slice(0, 3); // NOSONAR: Safe — display order shuffling, not security-sensitive.
    }, [activeSessionId]);

    const activeSession = sessions.find((s) => s.id === activeSessionId) ||
      (activeSessionId === "default" ? { id: "default", title: "New Chat", history: [] } : sessions[0]) ||
      { id: "default", title: "New Chat", history: [] };
    const chatHistory = activeSession.history;

    const setChatHistory = (updater: ChatHistoryUpdater) => {
      setSessions((prev: ChatSession[]) => {
        let found = false;
        let updated = prev.map((s: ChatSession) => {
          if (s.id === activeSessionId) {
            found = true;
            const newHistory: ChatHistoryItem[] =
              typeof updater === "function" ? updater(s.history) : updater;
            let newTitle = s.title;
            if (s.title === "New Chat") {
              const firstUser = newHistory.find(
                (m: ChatHistoryItem) => m.sender === "user", // NOSONAR
              );
              if (firstUser) {
                newTitle =
                  firstUser.message.slice(0, 24) +
                  (firstUser.message.length > 24 ? "..." : "");
              }
            }
            return { ...s, title: newTitle, history: newHistory };
          }
          return s;
        });
        if (!found) {
          const newHistory: ChatHistoryItem[] =
            typeof updater === "function" ? updater([]) : updater;
          let newTitle = "New Chat";
          const firstUser = newHistory.find(
            (m: ChatHistoryItem) => m.sender === "user",
          );
          if (firstUser) {
            newTitle =
              firstUser.message.slice(0, 24) +
              (firstUser.message.length > 24 ? "..." : "");
          }
          updated = [{ id: activeSessionId, title: newTitle, history: newHistory }, ...updated];
        }

        localStorage.setItem(
          "chat_with_elliot_sessions",
          JSON.stringify(updated),
        );
        return updated;
      });
    };

    useEffect(() => {
      localStorage.setItem("chat_with_elliot_sessions", JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
      localStorage.setItem("chat_with_elliot_active_session_id", activeSessionId);
    }, [activeSessionId]);

    const [isArchivedOpen, setIsArchivedOpen] = useState(false);
    const [isPinnedOpen, setIsPinnedOpen] = useState(true);

    const handleNewChat = () => {
      dispatch(clearChatbotPublicStatus());
      dispatch(clearChatWithElliotStatus());
      const newId = "default";
      setSessions((prev) => {
        const existingDefault = prev.find((s) => s.id === newId);
        if (existingDefault) {
          if (existingDefault.history.length > 0) {
            return [{ id: newId, title: "New Chat", history: [] }, ...prev.filter(s => s.id !== newId)];
          }
          return prev;
        }
        return [{ id: newId, title: "New Chat", history: [] }, ...prev];
      });
      setActiveSessionId(newId);
      setQuotedText("");
      setBotSpeakingText("");
      setSpokenCharIndex(-1);
      if (voicePanelState === "speaking") {
        stopTTS();
      }
    };

    const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        if (id !== "default") {
          await api.delete(`/api/ai/chat/session/${id}`);
        }
      } catch (err) {
        console.error("Failed to delete session:", err);
      }
      setSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        if (filtered.length === 0) {
          return [{ id: "default", title: "New Chat", history: [] }];
        }
        return filtered;
      });
      if (activeSessionId === id) {
        setActiveSessionId((prev) => {
          const nextSession = sessions.find((s) => s.id !== id);
          return nextSession?.id || "default";
        });
      }
    };

    const handleTogglePin = async (id: string) => {
      const sessionItem = sessions.find((s) => s.id === id);
      const nextPinned = !sessionItem?.isPinned;
      try {
        if (id !== "default") {
          await api.put(`/api/ai/chat/session/${id}/pin`, { is_pinned: nextPinned });
        }
      } catch (err) {
        console.error("Failed to pin session:", err);
      }
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPinned: nextPinned } : s)),
      );
      setMenuAnchorEl(null);
      setActiveMenuSessionId(null);
    };

    const handleToggleArchive = async (id: string) => {
      const sessionItem = sessions.find((s) => s.id === id);
      const nextArchived = !sessionItem?.isArchived;
      try {
        if (id !== "default") {
          await api.put(`/api/ai/chat/session/${id}/archive`, { is_archived: nextArchived });
        }
      } catch (err) {
        console.error("Failed to archive session:", err);
      }
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isArchived: nextArchived } : s)),
      );
      setMenuAnchorEl(null);
      setActiveMenuSessionId(null);
      if (activeSessionId === id) {
        const firstNonArchived = sessions.find(
          (s) => s.id !== id && !s.isArchived,
        );
        setActiveSessionId(firstNonArchived?.id || "default");
      }
      setMenuAnchorEl(null);
      setActiveMenuSessionId(null);
    };

    const startRename = (id: string, currentTitle: string) => {
      setRenameSessionId(id);
      setRenameTitle(currentTitle);
      setMenuAnchorEl(null);
      setActiveMenuSessionId(null);
    };

    const saveRename = async (id: string) => {
      if (renameTitle.trim()) {
        try {
          if (id !== "default") {
            await api.put(`/api/ai/chat/session/${id}/title`, { title: renameTitle.trim() });
          }
        } catch (err) {
          console.error("Failed to rename session:", err);
        }
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, title: renameTitle.trim() } : s,
          ),
        );
      }
      setRenameSessionId(null);
    };

    const handleExportChat = (sessionIdToExport?: string) => { // NOSONAR
      const targetSessionId = sessionIdToExport || activeSessionId;
      const sessionToExport = sessions.find(s => s.id === targetSessionId);
      const historyToExport = targetSessionId === activeSessionId ? chatHistory : (sessionToExport?.history || []);

      if (!historyToExport || historyToExport.length === 0) return;

      let content = `Chat with Elliot - ${new Date().toLocaleString()}\n`;
      if (sessionToExport?.title && sessionToExport.title !== "New Chat") {
        content += `Topic: ${sessionToExport.title}\n`;
      }
      content += `\n`;

      historyToExport.forEach((msg) => {
        content += `${msg.sender === "user" ? "You" : "Elliot"}:\n`;
        if (msg.screens && msg.screens.length > 0) content += `[Screens: ${msg.screens.join(', ')}]\n`;
        if (msg.exams && msg.exams.length > 0) content += `[Exams: ${msg.exams.join(', ')}]\n`;
        content += `${msg.message}\n\n`;
      });
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Elliot_Chat_${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setMenuAnchorEl(null);
      setActiveMenuSessionId(null);
    };

    const [isDragging, setIsDragging] = useState(false); // NOSONAR
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setAttachedFiles(prev => [...prev, ...droppedFiles]);
      }
    };
    const [isTyping, setIsTyping] = useState(false);

    const isFirstRender = useRef(true);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

    const SCREENS = ["Dashboard", "Roles", "Users", "Regions", "Inventory", "Orders", "Settings", "Analytics", "Reports", "Billing"];
    const EXAMS = ["Maths Final", "Science Midterm", "English Quiz", "History Test", "Physics Lab", "Aptitude Test"];

    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashSearch, setSlashSearch] = useState("");
    const [slashMenuIndex, setSlashMenuIndex] = useState(0);
    const [selectedScreens, setSelectedScreens] = useState<string[]>([]);

    const [showAtMenu, setShowAtMenu] = useState(false);
    const [atSearch, setAtSearch] = useState("");
    const [atMenuIndex, setAtMenuIndex] = useState(0);
    const [selectedExams, setSelectedExams] = useState<string[]>([]);





    useEffect(() => {
      const synth = globalThis.speechSynthesis;
      if (!synth) return;
      const populateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoiceURI) {
          const preferred = availableVoices.find(v => v.name.includes("Zira") || v.name.includes("UK English Female") || v.name.includes("Female")) || availableVoices[0];
          setSelectedVoiceURI(preferred.voiceURI);
        }
      };
      populateVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
      }
      return () => {
        synth.onvoiceschanged = null;
      };
    }, [selectedVoiceURI]);

    // Inline Speech Recognition (STT for Chat Input)
    const startInputSpeech = () => {
      const SpeechRecognition =
        (globalThis as any).SpeechRecognition ||
        (globalThis as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert(
          "Speech recognition is not supported in this browser. Try Chrome or Edge!",
        );
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListeningToInput(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        methods.setValue("message", transcript, {
          shouldValidate: true,
          shouldDirty: true,
        });
      };

      rec.onerror = (event: any) => {
        console.error("STT input error:", event.error);
        setIsListeningToInput(false);
      };

      rec.onend = () => {
        setIsListeningToInput(false);
        // Auto-submit if there is a recorded message
        setTimeout(() => {
          const currentText = methods.getValues("message") || "";
          if (currentText.trim() !== "") {
            formRef.current?.requestSubmit();
          }
        }, 300);
      };

      inputRecognitionRef.current = rec;
      rec.start();
    };

    const stopInputSpeech = () => {
      if (inputRecognitionRef.current) {
        inputRecognitionRef.current.stop();
      }
      setIsListeningToInput(false);
    };

    const handleToggleInputListening = () => {
      if (isListeningToInput) {
        stopInputSpeech();
      } else {
        startInputSpeech();
      }
    };

    // Text-To-Speech (TTS) Core Logic
    const speakMessage = (text: string, index: number, overrideRate?: number, overrideVoice?: string, startFromIndex: number = 0) => {
      const synth = globalThis.speechSynthesis;
      if (!synth) return;

      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current.onboundary = null;
      }

      synth.cancel();

      // Strip markdown formatting before speaking
      const cleanText = text
        .replaceAll(/[*#_`~-]/g, "")
        .replaceAll(/\$\$[\s\S]*?\$\$/g, "")
        .replaceAll(/\$[\s\S]*?\$/g, "")
        .replaceAll(/\\\[[\s\S]*?\\\]/g, "")
        .replaceAll(/\\\([\s\S]*?\\\)/g, "")
        .trim();

      const utteranceText = startFromIndex > 0 ? cleanText.substring(startFromIndex) : cleanText;
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.rate = overrideRate ?? speechRate;

      const targetVoiceURI = overrideVoice ?? selectedVoiceURI;
      if (targetVoiceURI) {
        const synthVoices = globalThis.speechSynthesis.getVoices();
        const voice = synthVoices.find(v => v.voiceURI === targetVoiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }
      utteranceRef.current = utterance;
      setActiveTTSIndex(index);
      setIsPlayingTTS(true);
      setIsPausedTTS(false);
      setBotSpeakingText(cleanText);
      if (startFromIndex === 0) {
        setSpokenCharIndex(-1);
      }

      if (isVoicePanelOpenRef.current) {
        // Update ref SYNCHRONOUSLY first — stopVoicePanelListening reads this
        voicePanelStateRef.current = "speaking";
        setVoicePanelState("speaking");
        stopVoicePanelListening(); // Kill SpeechRecognition immediately
        stopBargeInMonitoring(); // Ensure any existing volume monitoring is stopped
        if (bargeInThresholdRef.current < 150) {
          startBargeInMonitoring();
        }
      }

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setSpokenCharIndex(startFromIndex + event.charIndex);
        }
      };

      utterance.onend = () => {
        console.log("[TTS] Utterance ended naturally");
        setSpokenCharIndex(-1);
        isSubmittingRef.current = false; // Allow next submission
        setIsPlayingTTS(false);
        setIsPausedTTS(false);
        setActiveTTSIndex(null);
        setBotSpeakingText("");
        stopBargeInMonitoring();

        if (
          isVoicePanelOpenRef.current &&
          voicePanelStateRef.current === "speaking"
        ) {
          voicePanelStateRef.current = "listening";
          setVoicePanelState("listening");
          startBargeInMonitoring();
          setTimeout(() => {
            if (
              isVoicePanelOpenRef.current &&
              voicePanelStateRef.current === "listening"
            ) {
              startVoicePanelListening();
            }
          }, 200);
        }
      };

      utterance.onerror = (e) => {
        console.log("[TTS] Error/interrupted:", e.error);
        setSpokenCharIndex(-1);
        isSubmittingRef.current = false;
        setIsPlayingTTS(false);
        setIsPausedTTS(false);
        setActiveTTSIndex(null);
        setBotSpeakingText("");
        stopBargeInMonitoring();

        // Only restart if still in speaking (not if barge-in already transitioned to interrupted)
        if (
          isVoicePanelOpenRef.current &&
          voicePanelStateRef.current === "speaking"
        ) {
          voicePanelStateRef.current = "listening";
          setVoicePanelState("listening");
          startBargeInMonitoring();
          setTimeout(() => {
            if (
              isVoicePanelOpenRef.current &&
              voicePanelStateRef.current === "listening"
            ) {
              startVoicePanelListening();
            }
          }, 200);
        }
      };

      synth.speak(utterance);
    };

    const pauseTTS = () => {
      const synth = globalThis.speechSynthesis;
      if (synth && synth.speaking && !synth.paused) {
        synth.pause();
        setIsPausedTTS(true);
      }
    };

    const resumeTTS = () => {
      const synth = globalThis.speechSynthesis;
      if (synth?.paused) {
        synth.resume();
        setIsPausedTTS(false);
      }
    };

    const stopTTS = () => {
      const synth = globalThis.speechSynthesis;
      if (synth) {
        synth.cancel();
        setIsPlayingTTS(false);
        setIsPausedTTS(false);
        setActiveTTSIndex(null);
        setBotSpeakingText("");
        setSpokenCharIndex(-1);
      }
      stopBargeInMonitoring();
    };

    // Barge-In Support Core Functions
    const startBargeInMonitoring = async () => {
      try {
        // Clean up previous monitoring session if exists
        stopBargeInMonitoring();

        // 1. Request microphone access with echo cancellation constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        microphoneStreamRef.current = stream;

        // 2. Setup AudioContext and AnalyserNode
        const AudioContextClass =
          globalThis.AudioContext || (globalThis as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let speechDurationTicks = 0;
        const startTime = Date.now();

        // 3. Continuously monitor volume level (every 50ms)
        audioIntervalRef.current = setInterval(() => { // NOSONAR
          if (!analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);

          // Average only the frequency bins corresponding to the human voice range (approx 100Hz - 4kHz)
          // For a 44.1kHz sample rate with fftSize 256, index 1 (~172Hz) to 24 (~4100Hz) is ideal
          let sum = 0;
          const startBin = 1;
          const endBin = Math.min(24, bufferLength);
          for (let i = startBin; i < endBin; i++) {
            sum += dataArray[i];
          }
          const averageVolume = sum / (endBin - startBin);

          const currentState = voicePanelStateRef.current;

          // Listening mode: Toggle user voice active flag
          if (currentState === "listening") {
            if (averageVolume > 12) {
              setIsVoiceActive(true);
            } else {
              setIsVoiceActive(false);
            }
          }

          // Speaking mode: Monitor for barge-in interruption
          if (currentState === "speaking" && bargeInThresholdRef.current < 150) {
            // Cooldown: Ignore first 1.5 seconds of assistant speech to let echo cancellation filter adapt
            if (Date.now() - startTime < 1500) {
              return;
            }

            if (averageVolume > bargeInThresholdRef.current) {
              speechDurationTicks++;
              // Require sound to exceed threshold for at least 3 ticks (150ms) to ignore random echo spikes
              if (speechDurationTicks >= 3) {
                handleBargeInInterrupt();
                speechDurationTicks = 0;
              }
            } else {
              speechDurationTicks = 0;
            }
          }
        }, 50);
      } catch (err) {
        console.error("Audio monitoring initialization failed:", err);
      }
    };

    const stopBargeInMonitoring = () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
        microphoneStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => { });
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };


    const handleBargeInInterrupt = () => {
      const synth = globalThis.speechSynthesis;
      const isSpeaking =
        synth?.speaking || voicePanelStateRef.current === "speaking";

      if (isSpeaking) {
        console.log("[Barge-In] Interruption triggered!");

        // Set ref SYNCHRONOUSLY before cancel so utterance.onerror sees 'listening' state
        // and does NOT double-start SpeechRecognition
        voicePanelStateRef.current = "listening";

        // Stop assistant speech — this fires utterance.onerror
        if (synth) synth.cancel();

        setIsPlayingTTS(false);
        setIsPausedTTS(false);
        setActiveTTSIndex(null);
        setSpokenCharIndex(-1);

        // Stop barge-in monitoring
        stopBargeInMonitoring();

        // Update React state directly to listening
        setVoicePanelState("listening");
        stopVoicePanelListening();

        // Start listening for user speech immediately
        setTimeout(() => {
          if (
            isVoicePanelOpenRef.current &&
            voicePanelStateRef.current === "listening"
          ) {
            startBargeInMonitoring();
            startVoicePanelListening();
          }
        }, 50);
      }
    };

    // Voice Chat Panel Control Logic
    const handleOpenVoicePanel = () => {
      setIsVoicePanelOpen(true);
      setVoiceTimer(0);
      setVoicePanelState("listening");
      stopTTS();
      startBargeInMonitoring();
      setTimeout(() => {
        startVoicePanelListening(); // Only listen for user speech
      }, 200);
    };

    const handleCloseVoicePanel = () => {
      stopVoicePanelListening();
      stopBargeInMonitoring();
      stopTTS();
      setIsVoicePanelOpen(false);
    };

    const handleToggleVoiceMute = () => {
      if (voiceMuted) {
        setVoiceMuted(false);
        if (isVoicePanelOpen && voicePanelState === "listening") {
          startBargeInMonitoring();
          setTimeout(() => {
            startVoicePanelListening(); // Only speech recognition, no barge-in during listening
          }, 100);
        }
      } else {
        setVoiceMuted(true);
        stopVoicePanelListening();
        stopBargeInMonitoring();
      }
    };

    const handleToggleBargeIn = () => { // NOSONAR
      const newThreshold = bargeInThreshold >= 150 ? 85 : 150;
      setBargeInThreshold(newThreshold);
      bargeInThresholdRef.current = newThreshold;

      if (newThreshold < 150 && voicePanelState === "speaking") {
        startBargeInMonitoring();
      } else if (newThreshold >= 150) {
        stopBargeInMonitoring();
      }
    };

    const startVoicePanelListening = () => {
      if (voiceMutedRef.current) return;
      if (!isVoicePanelOpenRef.current) return;

      const SpeechRecognition =
        (globalThis as any).SpeechRecognition ||
        (globalThis as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("[Voice] SpeechRecognition not supported.");
        return;
      }

      // Assign a unique session ID BEFORE stopping old session.
      // Old onend callbacks capture their session ID and will bail if it's stale.
      recognitionSessionIdRef.current += 1;
      const mySessionId = recognitionSessionIdRef.current;

      // Mark intent to listen
      shouldListenRef.current = true;

      // Stop existing session silently — its onend will check session ID and bail
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) { console.error(e); }
        voiceRecognitionRef.current = null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        console.log("[Voice] Recognition started (session:", mySessionId, ")");
        setVoicePanelState("listening");
        setVoiceTranscript("");
        setIsVoiceActive(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      };

      rec.onsoundstart = () => {
        setIsVoiceActive(true);
      };

      rec.onsoundend = () => {
        setIsVoiceActive(false);
      };

      rec.onspeechstart = () => {
        setIsVoiceActive(true);
      };

      rec.onspeechend = () => {
        setIsVoiceActive(false);
      };

      rec.onresult = (event: any) => {
        // Session guard: drop results from stale sessions
        if (recognitionSessionIdRef.current !== mySessionId) return;
        if (!shouldListenRef.current || !isVoicePanelOpenRef.current) {
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          return;
        }

        // Concatenate all results from the beginning of the continuous recognition session
        let fullTranscript = "";
        for (const result of event.results) {
          fullTranscript += result[0].transcript;
        }

        if (fullTranscript) {
          setVoiceTranscript(fullTranscript);
        }

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        if (fullTranscript.trim()) {
          silenceTimeoutRef.current = setTimeout(() => {
            if (
              shouldListenRef.current &&
              isVoicePanelOpenRef.current &&
              recognitionSessionIdRef.current === mySessionId
            ) {
              console.log(
                "[Voice] Silence timeout reached — auto-submitting:",
                fullTranscript,
              );
              handleVoiceSubmit(fullTranscript);
            }
          }, 2000); // 2 seconds silence delay
        }
      };

      rec.onerror = (event: any) => {
        // 'aborted' is expected when we call stop() programmatically — silently ignore
        if (event.error === "aborted") return;
        console.warn(
          "[Voice] Recognition error:",
          event.error,
          "(session:",
          mySessionId,
          ")",
        );
      };

      rec.onend = () => {
        setIsVoiceActive(false);
        // Session guard: stale sessions must NOT restart
        if (recognitionSessionIdRef.current !== mySessionId) {
          console.log(
            "[Voice] Stale onend ignored (session:",
            mySessionId,
            "current:",
            recognitionSessionIdRef.current,
            ")",
          );
          return;
        }

        console.log(
          "[Voice] Recognition ended (session:",
          mySessionId,
          ") shouldListen:",
          shouldListenRef.current,
        );

        if (
          shouldListenRef.current &&
          isVoicePanelOpenRef.current &&
          !voiceMutedRef.current
        ) {
          setTimeout(() => {
            // Check again inside timeout — state may have changed
            if (
              shouldListenRef.current &&
              isVoicePanelOpenRef.current &&
              !voiceMutedRef.current &&
              recognitionSessionIdRef.current === mySessionId
            ) {
              console.log("[Voice] Restarting recognition for next turn...");
              startVoicePanelListening();
            }
          }, 300);
        }
      };

      voiceRecognitionRef.current = rec;
      try {
        rec.start();
      } catch (e) {
        console.error("[Voice] Failed to start recognition:", e);
      }
    };

    const stopVoicePanelListening = () => {
      // Invalidate current session — any pending onend will see stale session ID and bail
      recognitionSessionIdRef.current += 1;
      shouldListenRef.current = false;
      setIsVoiceActive(false);

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.stop();
        } catch (e) { console.error(e); }
        voiceRecognitionRef.current = null;
      }
      console.log("[Voice] Recognition stopped");
    };

    const handleVoiceSubmit = (text: string) => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      const trimmed = text.trim();
      if (!trimmed) return;

      // Prevent duplicate submissions
      if (isSubmittingRef.current) {
        console.log("[Voice] Duplicate submit blocked");
        return;
      }
      if (!shouldListenRef.current) {
        console.log("[Voice] Ignored submit — not in listening state");
        return;
      }

      isSubmittingRef.current = true;
      console.log("[Voice] Submitting:", trimmed);

      // Update ref synchronously before stopVoicePanelListening invalidates session
      voicePanelStateRef.current = "processing";
      stopVoicePanelListening();
      setVoicePanelState("processing");

      setChatHistory((prev) => [...prev, { sender: "user", message: trimmed }]);

      const isUcat = globalThis.location.hostname.toLowerCase().includes("ucat");
      let agentId: number | undefined = undefined;

      if (selectedAgent === "General Assistant") {
        const targetAgentIdStr = isUcat ? "UCATchat" : "chat";
        const matchedAgent = dbAgents.find(
          (a: any) => a.agent_id?.toLowerCase() === targetAgentIdStr.toLowerCase()
        );
        agentId = matchedAgent?.id;
      } else {
        const matchedAgent = dbAgents.find(
          (a: any) => a.agent_name?.toLowerCase().trim() === (selectedAgent as any).toLowerCase().trim()
        );
        agentId = matchedAgent?.id;
      }

      if (agentId === undefined) { // NOSONAR
        agentId = isUcat ? 12 : 4;
      }

      dispatch(
        ChatWithElliot({
          message: trimmed,
          application: applicationName,
          session_id: activeSessionId === "default" ? undefined : activeSessionId,
          agent_id: agentId,
        }),
      );
    };

    // Voice Panel Timer
    useEffect(() => {
      if (isVoicePanelOpen) {
        setVoiceTimer(0);
        voiceTimerRef.current = setInterval(() => {
          setVoiceTimer((prev) => prev + 1);
        }, 1000);
      } else if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current);
      }
      return () => {
        if (voiceTimerRef.current) {
          clearInterval(voiceTimerRef.current);
        }
      };
    }, [isVoicePanelOpen]);

    // Autoplay TTS for new bot responses
    const lastSpokenIndexRef = useRef<number>(chatHistory.length > 0 ? chatHistory.length - 1 : -1);

    useEffect(() => {
      if (chatHistory.length > 0) {
        const lastIndex = chatHistory.length - 1;
        const lastMessage = chatHistory[lastIndex];

        // Don't speak if panel is closed, but keep track of index so it doesn't speak old messages when opened
        if (!isVoicePanelOpen) {
          lastSpokenIndexRef.current = lastIndex;
          return;
        }

        if (
          lastMessage.sender === "bot" &&
          lastSpokenIndexRef.current !== lastIndex &&
          autoPlayTTS
        ) {
          lastSpokenIndexRef.current = lastIndex;
          speakMessage(lastMessage.message, lastIndex);
        }
      }
    }, [chatHistory, autoPlayTTS, isVoicePanelOpen]);

    // Transition voice panel to speaking when bot response arrives
    useEffect(() => {
      if (chatbotData && Object.keys(chatbotData).length > 0 && isVoicePanelOpen && voicePanelState === "processing") {
        setVoicePanelState("speaking");
      }
    }, [chatbotData]);

    // Fallback for real API if it fails or completes
    useEffect(() => {
      if (
        !chatloading &&
        !localLoading &&
        isVoicePanelOpen &&
        voicePanelState === "processing"
      ) {
        const lastMsg = chatHistory.at(-1);
        if (lastMsg?.sender === "user") {
          const hasBotResponded = chatHistory.some(
            (item, index) =>
              index > chatHistory.indexOf(lastMsg) && item.sender === "bot",
          );
          if (!hasBotResponded) {
            setTimeout(() => {
              const reply = getMockResponse(selectedAgent, lastMsg.message);
              if (!reply) return; // getMockResponse returned undefined — General Assistant is handled by API
              setChatHistory((prev) => [
                ...prev,
                { sender: "bot", message: reply || "", alreadyTyped: false },
              ]);
              setVoicePanelState("speaking");
            }, 1000);
          }
        }
      }
    }, [chatloading, localLoading]);

    const normalizeMessage = (msg: string) => stripHtmlTags(msg).trim();

    const handleFinishTyping = useCallback((index: number) => {
      setIsTyping(false);
      setSpeedUpIndex(null);
      setChatHistory((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, alreadyTyped: true } : item,
        ),
      );
    }, []);

    useLayoutEffect(() => {
      dispatch(clearChatWithElliotStatus());
    }, []);

    const onSubmit: SubmitHandler<IChatbotPublic> = async (data: any) => { // NOSONAR
      if (isLoadingActive) return;
      const userMessageRaw = data?.message || "";
      if (!userMessageRaw.trim() && attachedFiles.length === 0) return;

      const payloadText = userMessageRaw.trim()
        ? userMessageRaw
        : `[Attached ${attachedFiles.length} file(s)]`;
      const payloadMessage = quotedText
        ? `> "${quotedText}"\n\n${payloadText}`
        : payloadText;

      if (isTyping) {
        setIsTyping(false);
        setChatHistory((prev) =>
          prev.map((item) => ({ ...item, alreadyTyped: true })),
        );
      }

      const fileAttachments = await Promise.all(
        attachedFiles.map(async (file) => {
          let fileUrl = "";
          // For files smaller than 2MB, use Base64 to persist across reloads.
          // For larger media files, use blob URL to prevent localStorage crash/freezing.
          if (file.size < 2 * 1024 * 1024) {
            fileUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string); // NOSONAR
              reader.readAsDataURL(file);
            });
          } else {
            fileUrl = URL.createObjectURL(file);
          }
          return {
            name: file.name,
            url: fileUrl,
            isImage: file.type.startsWith("image/"),
            isVideo: file.type.startsWith("video/"),
            isAudio: file.type.startsWith("audio/"),
          };
        }),
      );

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "user",
          message: userMessageRaw,
          quotedText: quotedText,
          attachments: fileAttachments,
        },
      ]);

      methods.reset({ message: "" });
      setQuotedText("");
      setAttachedFiles([]);
      setSelectedScreens([]);
      setSelectedExams([]);

      const isUcat = globalThis.location.hostname.toLowerCase().includes("ucat");
      let agentId: number | undefined = undefined;

      if (selectedAgent === "General Assistant") {
        const targetAgentIdStr = isUcat ? "UCATchat" : "chat";
        const matchedAgent = dbAgents.find(
          (a: any) => a.agent_id?.toLowerCase() === targetAgentIdStr.toLowerCase()
        );
        agentId = matchedAgent?.id;
      } else {
        const matchedAgent = dbAgents.find((a: any) => a.agent_name === selectedAgent);
        agentId = matchedAgent?.id;
      }

      if (agentId === undefined) { // NOSONAR
        agentId = isUcat ? 12 : 4;
      }

      dispatch(
        ChatWithElliot({
          message: payloadMessage,
          application: applicationName,
          session_id: activeSessionId === "default" ? undefined : activeSessionId,
          agent_id: agentId,
        }),
      );
    };

    useEffect(() => { // NOSONAR
      if (chatbotData && Object.keys(chatbotData).length > 0) {
        let botMessage = "";
        let chunkId: number | undefined = undefined;
        let sessionId: string | undefined = undefined;

        let extractedData = chatbotData?.data;
        if (typeof extractedData === "string") {
          try {
            extractedData = JSON.parse(extractedData);
          } catch (e) { // NOSONAR
            // ignore parsing error
          }
        }

        if (typeof chatbotData === "string") {
          botMessage = chatbotData;
        } else if (extractedData?.response) {
          botMessage = extractedData.response;
          chunkId = extractedData.conversation_chunk_id;
          sessionId = extractedData.session_id;
        } else if (extractedData?.data?.response) {
          botMessage = extractedData.data.response;
          chunkId = extractedData.data.conversation_chunk_id;
          sessionId = extractedData.data.session_id;
        } else if (chatbotData?.data?.response) {
          botMessage = chatbotData.data.response;
          chunkId = chatbotData.data.conversation_chunk_id;
          sessionId = chatbotData.data.session_id;
        } else if (chatbotData?.message && chatbotData.message !== "Chat response") {
          botMessage = chatbotData.message;
        } else if (chatbotData?.message) {
          botMessage = chatbotData.message;
        }

        const responseSessionId = extractedData?.session_id || extractedData?.data?.session_id || chatbotData?.session_id;
        if (responseSessionId && activeSessionId === "default") {
          setActiveSessionId(responseSessionId);
          fetchSessions();
        }

        if (sessionId && activeSessionId === "default") {
          setActiveSessionId(sessionId);
          setTimeout(() => {
            fetchSessions();
          }, 1000);
          setTimeout(() => {
            fetchSessions();
          }, 3000);
          setTimeout(() => {
            fetchSessions();
          }, 6000);
        }

        setSessions((prev) => {
          const updated = prev.map((s: ChatSession) => { // NOSONAR
            if (s.id === activeSessionId || (activeSessionId === "default" && s.id === "default")) {
              const lastMsg = s.history[s.history.length - 1]; // NOSONAR
              if (
                lastMsg?.sender === "bot" &&
                normalizeMessage(lastMsg.message) === normalizeMessage(botMessage)
              ) {
                return s.id === "default" && sessionId ? { ...s, id: sessionId } : s;
              }
              const newHistory: ChatHistoryItem[] = [
                ...s.history,
                {
                  sender: "bot",
                  message: botMessage,
                  alreadyTyped: isFirstRender.current,
                  conversation_chunk_id: chunkId,
                },
              ];

              let newTitle = s.title;
              if (s.title === "New Chat") {
                const firstUser = newHistory.find(
                  (m: ChatHistoryItem) => m.sender === "user" // NOSONAR
                );
                if (firstUser) {
                  newTitle =
                    firstUser.message.slice(0, 24) +
                    (firstUser.message.length > 24 ? "..." : "");
                }
              }

              return {
                ...s,
                id: s.id === "default" && sessionId ? sessionId : s.id,
                title: newTitle,
                history: newHistory,
              };
            }
            return s;
          });
          localStorage.setItem(
            "chat_with_elliot_sessions",
            JSON.stringify(updated),
          );
          return updated;
        });
        if (!isFirstRender.current) {
          setIsTyping(true);
        }
      }
    }, [chatbotData]);

    // Fallback for General Assistant normal view if API fails
    useEffect(() => {
      if (!chatloading && chatHistory.length > 0) {
        const lastMsg = chatHistory[chatHistory.length - 1]; // NOSONAR
        if (
          lastMsg && // NOSONAR
          lastMsg.sender === "user" &&
          selectedAgent === "General Assistant"
        ) {
          const hasBotResponded = chatHistory.some(
            (item, index) =>
              index > chatHistory.indexOf(lastMsg) && item.sender === "bot",
          );
          if (!hasBotResponded && !localLoading) {
            const timer = setTimeout(() => {
              const reply = getMockResponse(selectedAgent, lastMsg.message);
              if (!reply) return; // Ignore if undefined
              setChatHistory((prev) => [
                ...prev,
                { sender: "bot", message: reply || "", alreadyTyped: false },
              ]);
              setIsTyping(true);
              dispatch(successChatWithElliot({ message: reply }));
            }, 1000);
            return () => clearTimeout(timer);
          }
        }
      }
    }, [chatloading, chatHistory, selectedAgent]);

    const scrollToBottom = useCallback(() => {
      if (divRef.current) {
        setTimeout(() => {
          if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
          }
        }, 50);
      }
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [
      chatHistory,
      chatloading,
      localLoading,
      attachedFiles,
      quotedText,
      scrollToBottom,
    ]);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, [isLoadingActive]);

    const renderSpokenTextWithHighlight = (text: string, index: number) => {
      if (index < 0 || index >= text.length) return `"${text}"`;

      // Find the end of the current word
      let wordEnd = index;
      while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
        wordEnd++;
      }
      if (wordEnd === index) {
        wordEnd = index + 1;
      }

      const before = text.substring(0, index);
      const word = text.substring(index, wordEnd);
      const after = text.substring(wordEnd);

      return (
        <>
          "{before}
          <span
            id="active-spoken-word"
            style={{
              backgroundColor: "rgba(0, 157, 255, 0.25)",
              color: "#0055b3",
              padding: "2px 6px",
              borderRadius: "6px",
              fontWeight: "bold",
              margin: "0 2px",
            }}
          >
            {word}
          </span>
          {after}"
        </>
      );
    };

    useEffect(() => {
      if (spokenCharIndex >= 0) {
        const activeWord = document.getElementById("active-spoken-word");
        if (activeWord) {
          activeWord.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }, [spokenCharIndex]);

    useEffect(() => {
      isFirstRender.current = false;
    }, []);

    return (
      <Box
        className="elliot-chat-main-container"
        sx={{
          display: "flex",
          width: "100%",
          height: { xs: "calc(100vh - 70px)", md: "calc(100vh - 90px)" },
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {feedbackAnim && (
          <>
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0)",
                zIndex: 99998,
              }}
            />
            <FeedbackAnimation
              key={feedbackAnim.id}
              type={feedbackAnim.type}
              x={feedbackAnim.x}
              y={feedbackAnim.y}
            />
          </>
        )}
        {/* Sidebar: New Chat & Chat History */}
        <Box
          className="elliot-sidebar-container"
          sx={{
            width: isSidebarCollapsed ? "0px" : "260px",
            borderRight: isSidebarCollapsed ? "none" : "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            background: "#f9fafb",
            height: "100%",
            flexShrink: 0,
            p: isSidebarCollapsed ? 0 : 2,
            overflow: "hidden",
            transition: "width 0.3s ease, padding 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Elliot Profile Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={AvatarImage}
                className="chatbot-avatar"
                alt="Profile"
                sx={{ width: 40, height: 40 }}
              />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}
              >
                Elliot
              </Typography>
            </Box>
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tooltip title="Collapse Sidebar">
                    <IconButton
                      className="elliot-sidebar-collapse-btn"
                      onClick={() => setIsSidebarCollapsed(true)}
                      size="small"
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "50%",
                        p: 1.5,
                        color: "#374151"
                      }}
                    >
                      <PanelLeftCloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* New Chat Button */}
          <Button
            variant="outlined"
            onClick={handleNewChat}
            startIcon={<AddIcon />}
            sx={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#009dff",
              color: "#009dff",
              fontWeight: 600,
              mb: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 157, 255, 0.04)",
                borderColor: "#009dff",
              },
            }}
          >
            New Chat
          </Button>

          {/* Search Chat Button */}
          <Button
            variant="outlined"
            className="elliot-search-chat-btn"
            onClick={() => setIsSearchOpen(true)}
            startIcon={<SearchIcon />}
            sx={{
              width: "100%",
              height: "40px",
              justifyContent: "center",
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: "#4b5563",
              fontWeight: 500,
              mb: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
              },
            }}
          >
            Search chats
          </Button>

          {/* Pinned Chats Dropdown */}
          {sessions.some((s) => s.isPinned && !s.isArchived) && (
            <Box sx={{ mb: 2 }}>
              <Box
                onClick={() => setIsPinnedOpen(!isPinnedOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  p: 1,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#f9fafb" }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  PINNED CHATS
                </Typography>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isPinnedOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "#9ca3af"
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Box>

              {isPinnedOpen && (
                <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {sessions
                    .filter((s) => s.isPinned && !s.isArchived && !(s.id === "default" && s.history.length === 0))
                    .map((session) => (
                      <Box
                        key={session.id}
                        onClick={() => {
                          setActiveSessionId(session.id);
                          if (voicePanelState === "speaking") {
                            stopTTS();
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.2,
                          borderRadius: "8px",
                          cursor: "pointer",
                          backgroundColor:
                            session.id === activeSessionId
                              ? "rgba(0, 157, 255, 0.08)"
                              : "transparent",
                          color:
                            session.id === activeSessionId ? "#0055b3" : "var(--text-subtitle-2)",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor:
                              session.id === activeSessionId
                                ? "rgba(0, 157, 255, 0.12)"
                                : "rgba(0, 0, 0, 0.03)",
                            color: "#009dff",
                            "& .MuiTypography-root": {
                              color: "#009dff",
                            },
                          },
                          "&:hover .session-options": {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <PushPinIcon sx={{ fontSize: "16px", opacity: 0.7, transform: "rotate(45deg)" }} />
                          {renameSessionId === session.id ? (
                            <input
                              autoFocus
                              value={renameTitle}
                              onChange={(e) => setRenameTitle(e.target.value)}
                              onBlur={() => saveRename(session.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(session.id);
                                if (e.key === "Escape") setRenameSessionId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                border: "1px solid #009dff",
                                borderRadius: "4px",
                                padding: "2px 4px",
                                width: "100%",
                                outline: "none",
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              className="elliot-pinned-chat-title"
                              sx={{
                                fontWeight:
                                  session.id === activeSessionId ? 600 : 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "13px",
                                color: "inherit",
                              }}
                            >
                              {session.title}
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            className="session-options"
                            sx={{
                              opacity: activeMenuSessionId === session.id ? 1 : 0,
                              transition: "opacity 0.2s",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchorEl(e.currentTarget);
                                setActiveMenuSessionId(session.id);
                              }}
                              sx={{ padding: "4px" }}
                            >
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          )}

          {/* Archived Chats Dropdown */}
          {sessions.some((s) => s.isArchived) && (
            <Box sx={{ mb: 2 }}>
              <Box
                onClick={() => setIsArchivedOpen(!isArchivedOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  p: 1,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#f9fafb" }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  ARCHIVED CHATS
                </Typography>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isArchivedOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "#9ca3af"
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Box>

              {isArchivedOpen && (
                <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {sessions
                    .filter((s) => s.isArchived)
                    .map((session) => (
                      <Box
                        key={session.id}
                        onClick={() => {
                          setActiveSessionId(session.id);
                          if (voicePanelState === "speaking") {
                            stopTTS();
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.2,
                          borderRadius: "8px",
                          cursor: "pointer",
                          backgroundColor:
                            session.id === activeSessionId
                              ? "rgba(0, 157, 255, 0.08)"
                              : "transparent",
                          color:
                            session.id === activeSessionId ? "#0055b3" : "var(--text-subtitle-2)",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor:
                              session.id === activeSessionId
                                ? "rgba(0, 157, 255, 0.12)"
                                : "rgba(0, 0, 0, 0.03)",
                            color: "#009dff",
                            "& .MuiTypography-root": {
                              color: "#009dff",
                            },
                          },
                          "&:hover .session-options": {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <MessageCircleDashedIcon sx={{ fontSize: "16px", opacity: 1 }} />
                          <Typography
                            variant="body2"
                            className="elliot-archived-chat-title"
                            sx={{
                              fontWeight:
                                session.id === activeSessionId ? 600 : 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "13px",
                              color: "inherit",
                            }}
                          >
                            {session.title}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            className="session-options"
                            sx={{
                              opacity: activeMenuSessionId === session.id ? 1 : 0,
                              transition: "opacity 0.2s",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchorEl(e.currentTarget);
                                setActiveMenuSessionId(session.id);
                              }}
                              sx={{ padding: "4px" }}
                            >
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          )}

          {/* Chat History List Title */}
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontWeight: 700,
              mb: 1,
              pl: 1,
              letterSpacing: "0.5px",
            }}
          >
            RECENT CHATS
          </Typography>

          {/* Chat History Sessions */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#e2e8f0",
                borderRadius: "10px",
              },
            }}
          >
            {sessions
              .filter((s) => !s.isArchived && !s.isPinned && !(s.id === "default" && s.history.length === 0))
              .map((session) => (
                <Box
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    if (voicePanelState === "speaking") {
                      stopTTS();
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.2,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor:
                      session.id === activeSessionId
                        ? "rgba(0, 157, 255, 0.08)"
                        : "transparent",
                    color: session.id === activeSessionId ? "#0055b3" : "var(--text-subtitle-2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor:
                        session.id === activeSessionId
                          ? "rgba(0, 157, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.03)",
                      color: "#009dff",
                      "& .MuiTypography-root": {
                        color: "#009dff",
                      },
                    },
                    "&:hover .session-options": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle-icon lucide-message-circle"
                      style={{
                        opacity: 0.7,
                        color:
                          session.id === activeSessionId ? "#009dff" : "inherit",
                        flexShrink: 0,
                      }}
                    >
                      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                    </svg>
                    {renameSessionId === session.id ? (
                      <input
                        autoFocus
                        value={renameTitle}
                        onChange={(e) => setRenameTitle(e.target.value)}
                        onBlur={() => saveRename(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(session.id);
                          if (e.key === "Escape") setRenameSessionId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          border: "1px solid #009dff",
                          borderRadius: "4px",
                          padding: "2px 4px",
                          width: "100%",
                          outline: "none",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        className="elliot-recent-chat-title"
                        sx={{
                          fontWeight: session.id === activeSessionId ? 600 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "13px",
                          color: "inherit",
                        }}
                      >
                        {session.title}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {session.isPinned && (
                      <PushPinIcon
                        sx={{
                          fontSize: "14px",
                          opacity: 0.7,
                          mr: 0.5,
                          transform: "rotate(45deg)",
                          color: "#009dff"
                        }}
                      />
                    )}
                    <Box
                      className="session-options"
                      sx={{
                        opacity: activeMenuSessionId === session.id ? 1 : 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAnchorEl(e.currentTarget);
                          setActiveMenuSessionId(session.id);
                        }}
                        sx={{ padding: "4px" }}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}


          </Box>
        </Box>

        {/* Main content Box (Message area and footer input) */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <AnimatePresence>
              {isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  style={{
                    position: "absolute",
                    left: 5,
                    top: 20,
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                  className="elliot-floating-controls-container"
                >
                  <Tooltip title="Expand Sidebar">
                    <IconButton
                      className="elliot-sidebar-expand-btn"
                      onClick={() => setIsSidebarCollapsed(false)}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "50%",
                        p: 1.5,
                        color: "#374151",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        }
                      }}
                    >
                      <PanelLeftOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="New Chat">
                    <IconButton
                      className="elliot-sidebar-new-chat-floating-btn"
                      onClick={handleNewChat}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "50%",
                        p: 1.5,
                        color: "#374151",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        }
                      }}
                    >
                      <MessageSquarePlusIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Search Chats">
                    <IconButton
                      className="elliot-sidebar-search-floating-btn"
                      onClick={() => setIsSearchOpen(true)}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "50%",
                        p: 1.5,
                        color: "#374151",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        }
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Message Area */}
            <div
              ref={divRef}
              className="chatbot_message_area"
              onScroll={() => {
                if (divRef.current) {
                  const { scrollTop, scrollHeight, clientHeight } =
                    divRef.current;
                  const isAtBottom =
                    scrollHeight - scrollTop - clientHeight < 100;
                  setShowScrollBottom(!isAtBottom);
                }
              }}
              style={{
                overflowY: "auto",
                background: "#fff",
                paddingTop: "20px",
                paddingBottom: "16px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <AnimatePresence mode="wait">
                {isVoicePanelOpen ? (
                  <Box
                    key="voice-panel"
                    component={motion.div}
                    style={{
                      transformOrigin: "calc(100% - 60px) calc(100% + 40px)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      width: "100%",
                      position: "relative",
                      background: "#fff",
                    }}
                  >
                    <Box
                      className="elliot_voice_inner_wrapper"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        zIndex: 3,
                        transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                      }}
                    >
                      <Box
                        className="voice-sphere-container"
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 240,
                          height: 240,
                          cursor:
                            voicePanelState === "speaking"
                              ? "pointer"
                              : "default",
                        }}
                        onClick={() => {
                          if (voicePanelState === "speaking") {
                            handleBargeInInterrupt();
                          }
                        }}
                      >
                        {/* Glowing halo behind the 3D Sphere */}
                        <Box
                          sx={{
                            position: "absolute",
                            width: 160,
                            height: 160,
                            borderRadius: "50%",
                            backgroundColor:
                              voicePanelState === "listening"
                                ? isVoiceActive // NOSONAR
                                  ? "rgba(0, 157, 255, 0.45)"
                                  : "rgba(0, 157, 255, 0.15)"
                                : voicePanelState === "processing" // NOSONAR
                                  ? "rgba(236, 72, 153, 0.2)"
                                  : voicePanelState === "interrupted" // NOSONAR
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "rgba(16, 185, 129, 0.15)",
                            filter: isVoiceActive && voicePanelState === "listening" ? "blur(15px)" : "blur(20px)",
                            transform: isVoiceActive && voicePanelState === "listening" ? "scale(1.35)" : "scale(1)",
                            zIndex: 1,
                            transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          }}
                        />
                        <VoiceSphereThree state={voicePanelState} speechRate={speechRate} isVoiceActive={isVoiceActive} />
                      </Box>

                      <Box
                        className="elliot_voice_text_wrapper"
                        sx={{
                          textAlign: "center",
                          width: "100%",
                          maxWidth: "520px",
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1.5,
                          px: 1,
                          transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                          "&::-webkit-scrollbar": { width: "4px" },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#e2e8f0",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color:
                              voicePanelState === "listening"
                                ? "#009dff"
                                : voicePanelState === "processing" // NOSONAR
                                  ? "#ec4899"
                                  : voicePanelState === "interrupted" // NOSONAR
                                    ? "#ef4444"
                                    : "#10b981",
                            textTransform: "capitalize",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {voicePanelState === "listening"
                            ? voiceMuted // NOSONAR
                              ? "Muted"
                              : "Listening..."
                            : voicePanelState === "processing" // NOSONAR
                              ? "Thinking..."
                              : voicePanelState === "interrupted" // NOSONAR
                                ? "Interrupted..."
                                : "Speaking..."}
                        </Typography>
                        <Box
                          className="elliot_voice_transcript_container"
                          sx={{
                            color:
                              voicePanelState === "speaking"
                                ? "#1e293b"
                                : "#64748b",
                            fontStyle:
                              voicePanelState === "speaking"
                                ? "normal"
                                : "italic",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            backgroundColor:
                              voicePanelState === "speaking"
                                ? "rgba(0, 157, 255, 0.05)"
                                : "rgba(241, 245, 249, 0.5)",
                            border:
                              voicePanelState === "speaking"
                                ? "1px solid rgba(0, 157, 255, 0.15)"
                                : "1px solid #e2e8f0",
                            borderRadius: "14px",
                            p: 2,
                            display: "block",
                            boxShadow:
                              voicePanelState === "speaking"
                                ? "0 2px 10px rgba(0, 157, 255, 0.03)"
                                : "none",
                            width: "100%",
                            maxWidth: "500px",
                            textAlign: "center",
                            maxHeight: "160px",
                            overflowY: "auto",
                            transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                            "&::-webkit-scrollbar": { width: "4px" },
                            "&::-webkit-scrollbar-track": {
                              backgroundColor: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "#e2e8f0",
                              borderRadius: "10px",
                            },
                          }}
                        >
                          {voicePanelState === "speaking"
                            ? botSpeakingText // NOSONAR
                              ? renderSpokenTextWithHighlight(
                                botSpeakingText,
                                spokenCharIndex,
                              )
                              : ""
                            : voiceTranscript // NOSONAR
                              ? `"${voiceTranscript}"`
                              : voicePanelState === "listening" // NOSONAR
                                ? voiceMuted // NOSONAR
                                  ? "Unmute to speak"
                                  : "Try saying something..."
                                : voicePanelState === "interrupted" // NOSONAR
                                  ? "Listening to interruption..."
                                  : ""}
                        </Box>
                      </Box>

                      {/* Controls */}
                      <Box
                        className="elliot_voice_controls_container"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          mt: 4,
                          transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                      >
                        <Tooltip title="Voice Settings">
                          <IconButtonField
                            onClick={(e) => setVoicePopoverAnchor(e.currentTarget as unknown as HTMLDivElement)}
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: "#fff",
                              color: "#6b7280",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              "&:hover": { backgroundColor: "#f9fafb" },
                            }}
                          >
                            <SpeechIcon />
                          </IconButtonField>
                        </Tooltip>
                        <Tooltip title="Speech Speed">
                          <IconButtonField
                            onClick={(e) => setSpeedPopoverAnchor(e.currentTarget as unknown as HTMLDivElement)}
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: "#fff",
                              color: "#6b7280",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              "&:hover": { backgroundColor: "#f9fafb" },
                            }}
                          >
                            <GaugeIcon />
                          </IconButtonField>
                        </Tooltip>

                        <Tooltip
                          title={
                            voiceMuted ? "Unmute Microphone" : "Mute Microphone"
                          }
                        >
                          <IconButtonField
                            onClick={handleToggleVoiceMute}
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: voiceMuted
                                ? "rgba(239, 68, 68, 0.1)"
                                : "#fff",
                              color: voiceMuted ? "#ef4444" : "#6b7280",
                              border: voiceMuted
                                ? "1px solid #ef4444"
                                : "1px solid #e5e7eb",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              "&:hover": {
                                backgroundColor: voiceMuted
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : "#f9fafb",
                              },
                            }}
                          >
                            {voiceMuted ? <MicOffIcon /> : <MicIcon />}
                          </IconButtonField>
                        </Tooltip>

                        <Tooltip title="Stop & Listen">
                          <span>
                            <IconButtonField
                              disabled={voicePanelState !== "speaking"}
                              onClick={handleBargeInInterrupt}
                              sx={{
                                width: 56,
                                height: 56,
                                backgroundColor:
                                  voicePanelState !== "speaking" // NOSONAR
                                    ? "#fff"
                                    : "rgba(0, 157, 255, 0.1)",
                                color:
                                  voicePanelState !== "speaking" // NOSONAR
                                    ? "#9ca3af"
                                    : "#009dff",
                                border:
                                  voicePanelState !== "speaking" // NOSONAR
                                    ? "1px solid #e5e7eb"
                                    : "1px solid #009dff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                "&:hover": {
                                  backgroundColor:
                                    voicePanelState !== "speaking" // NOSONAR
                                      ? "#f9fafb"
                                      : "rgba(0, 157, 255, 0.2)",
                                },
                              }}
                            >
                              <HearingIcon />
                            </IconButtonField>
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={
                            voicePanelState === "speaking" &&
                              isPlayingTTS &&
                              !isPausedTTS
                              ? "Pause Voice"
                              : "Resume Voice"
                          }
                        >
                          <span style={{ display: "inline-flex" }}>
                            <IconButtonField
                              disabled={voicePanelState !== "speaking"}
                              onClick={() => {
                                if (isPausedTTS) {
                                  resumeTTS();
                                } else if (isPlayingTTS) {
                                  pauseTTS();
                                }
                              }}
                              sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: "#fff",
                                color:
                                  voicePanelState !== "speaking" // NOSONAR
                                    ? "#9ca3af"
                                    : "#6b7280",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                "&:hover": {
                                  backgroundColor: "#f9fafb",
                                },
                              }}
                            >
                              {voicePanelState === "speaking" &&
                                isPlayingTTS &&
                                !isPausedTTS ? (
                                <PauseIcon />
                              ) : (
                                <PlayArrowIcon />
                              )}
                            </IconButtonField>
                          </span>
                        </Tooltip>

                        <Tooltip title="Exit Voice Mode">
                          <IconButtonField
                            onClick={handleCloseVoicePanel}
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: "#ef4444",
                              color: "#fff",
                              boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)",
                              "&:hover": {
                                backgroundColor: "#dc2626",
                                boxShadow: "0 6px 15px rgba(239, 68, 68, 0.4)",
                              },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: "28px", color: "white" }} />
                          </IconButtonField>
                        </Tooltip>
                      </Box>
                      <Popover
                        open={Boolean(speedPopoverAnchor)}
                        anchorEl={speedPopoverAnchor}
                        onClose={() => setSpeedPopoverAnchor(null)}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                        sx={{ "& .MuiPaper-root": { borderRadius: "12px", p: 2, mb: 1, minWidth: "200px" } }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Speech Rate: {speechRate}x</Typography>
                        <Slider
                          value={speechRate}
                          onChange={(_, newValue) => setSpeechRate(newValue as number)}
                          step={0.1}
                          marks
                          min={0.5}
                          max={2}
                          valueLabelDisplay="auto"
                        />
                      </Popover>
                      <Menu
                        anchorEl={voicePopoverAnchor}
                        open={Boolean(voicePopoverAnchor)}
                        onClose={() => setVoicePopoverAnchor(null)}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                        sx={{ "& .MuiPaper-root": { borderRadius: "12px", mb: 1, maxHeight: "300px" } }}
                      >
                        {voices.map((voice) => (
                          <MenuItem
                            key={voice.voiceURI}
                            selected={voice.voiceURI === selectedVoiceURI}
                            onClick={() => {
                              setSelectedVoiceURI(voice.voiceURI);
                              setVoicePopoverAnchor(null);
                            }}
                            sx={{ fontSize: "14px", py: 1 }}
                          >
                            {voice.name}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key="chat-history"
                    component={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    sx={{
                      p: 2,
                      pl: isSidebarCollapsed ? 6 : 2,
                      margin: "0% 2%",
                      transition: "padding-left 0.3s ease",
                    }}
                  >
                    {/* Intro Empty State */}
                    {chatHistory.length === 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "60vh",
                          gap: 4,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, color: "#111827" }}
                        >
                          {initialGreeting}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            maxWidth: "600px",
                          }}
                        >
                          {randomSuggestions.map((suggestion, idx) => {
                            const isUcat = globalThis.location.hostname.toLowerCase().includes("ucat");
                            let agentId: number | undefined = undefined;

                            if (selectedAgent === "General Assistant") {
                              const targetAgentIdStr = isUcat ? "UCATchat" : "chat";
                              const matchedAgent = dbAgents.find(
                                (a) => a.agent_id?.toLowerCase() === targetAgentIdStr.toLowerCase()
                              );
                              agentId = matchedAgent?.id;
                            } else {
                              const matchedAgent = dbAgents.find(
                                (a) => a.agent_name?.toLowerCase().trim() === selectedAgent.toLowerCase().trim()
                              );
                              agentId = matchedAgent?.id;
                            }

                            if (agentId === undefined) { // NOSONAR
                              agentId = isUcat ? 12 : 4;
                            }

                            return (
                              <Button
                                key={idx} // NOSONAR
                                variant="outlined"
                                className="elliot-suggestion-button"
                                startIcon={suggestion.icon}
                                onClick={() => {
                                  setChatHistory((prev) => [
                                    ...prev,
                                    { sender: "user", message: suggestion.label },
                                  ]);
                                  dispatch(
                                    ChatWithElliot({
                                      message: suggestion.label,
                                      application: applicationName,
                                      session_id: activeSessionId === "default" ? undefined : activeSessionId,
                                      agent_id: agentId,
                                    }),
                                  );
                                }}
                                sx={{
                                  borderRadius: "20px",
                                  textTransform: "none",
                                  color: "#4b5563",
                                  borderColor: "#e5e7eb",
                                  fontWeight: 500,
                                  py: "8px",
                                  px: "16px",
                                  lineHeight: "1.2",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  "&:hover": {
                                    backgroundColor: "#f9fafb",
                                    borderColor: "#d1d5db",
                                  },
                                }}
                              >
                                {suggestion.label}
                              </Button>
                            )
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Chat History */}
                    {chatHistory.map((entry, index) => ( // NOSONAR
                      <Box
                        key={`msg-${index}`} // NOSONAR
                        sx={{
                          mb: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            entry.sender === "user" ? "flex-end" : "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor:
                              entry.sender === "user" ? "" : "#f3f4f6",
                            color: entry.sender === "user" ? "#fff" : "#333",
                            borderRadius: "16px",
                            maxWidth: entry.sender === "bot" ? "95%" : "70%",
                            width: "fit-content",
                            fontSize: "14px",
                            p: entry.sender === "bot" ? "12px 20px" : 0,
                          }}
                        >
                          {entry.sender === "bot" ? (
                            <TypewriterMarkdown
                              content={entry.message}
                              isLast={
                                index === chatHistory.length - 1 &&
                                !entry.alreadyTyped
                              }
                              speedUp={speedUpIndex === index}
                              onFinish={() => handleFinishTyping(index)}
                              onUpdate={() => {
                                if (divRef.current) {
                                  const {
                                    scrollTop,
                                    scrollHeight,
                                    clientHeight,
                                  } = divRef.current;
                                  const isAtBottom =
                                    scrollHeight - scrollTop - clientHeight < 30;
                                  if (isAtBottom) {
                                    divRef.current.scrollTop = scrollHeight;
                                  }
                                }
                              }}
                              className="chatWithelliot_bot_message"
                            />
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              {entry.attachments &&
                                entry.attachments.length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                      mb: entry.message.trim() ? 1 : 0,
                                      justifyContent: "flex-end",
                                      width: "100%",
                                    }}
                                  >
                                    {entry.attachments.map((att, i) =>
                                      att.isImage ? (
                                        <img
                                          key={i} // NOSONAR
                                          src={att.url}
                                          alt={att.name}
                                          onLoad={scrollToBottom}
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : att.isVideo ? ( // NOSONAR
                                        <video
                                          key={i} // NOSONAR
                                          src={att.url}
                                          controls
                                          onLoadedData={scrollToBottom}
                                          style={{
                                            maxWidth: "250px",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            outline: "none",
                                          }}
                                        >
                                          <track kind="captions" />
                                        </video>
                                      ) : att.isAudio ? ( // NOSONAR
                                        <audio
                                          key={i} // NOSONAR
                                          src={att.url}
                                          controls
                                          onLoadedData={scrollToBottom}
                                          style={{
                                            width: "250px",
                                            height: "40px",
                                            borderRadius: "8px",
                                            outline: "none",
                                          }}
                                        >
                                          <track kind="captions" />
                                        </audio>
                                      ) : (
                                        <Box
                                          key={i} // NOSONAR
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: "#009dff",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            boxShadow:
                                              "0 2px 8px rgba(0, 157, 255, 0.25)",
                                            minWidth: "200px",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              backgroundColor:
                                                "rgba(255,255,255,0.25)",
                                              borderRadius: "8px",
                                              padding: "8px",
                                              marginRight: "12px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            {getFileIcon(att.name, {
                                              fontSize: "24px",
                                              color: "#fff",
                                            })}
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "flex-start",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#fff",
                                                maxWidth: "150px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {att.name}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                color: "rgba(255,255,255,0.8)",
                                              }}
                                            >
                                              Document
                                            </Typography>
                                          </Box>
                                        </Box>
                                      ),
                                    )}
                                  </Box>
                                )}
                              {entry.quotedText && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    maxWidth: "100%",
                                    mb: 0.5,
                                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                                    padding: "8px 12px",
                                    borderRadius: "12px",
                                    borderLeft: "3px solid #009dff",
                                  }}
                                >
                                  <FormatQuoteIcon
                                    sx={{
                                      color: "#009dff",
                                      mr: 1,
                                      fontSize: "18px",
                                      opacity: 0.8,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      color: "#4b5563",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      wordBreak: "break-word",
                                      fontStyle: "italic",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {entry.quotedText}
                                  </Typography>
                                </Box>
                              )}
                              {entry.message.trim() && (
                                <Markdown
                                  remarkPlugins={remarkPluginsList}
                                  rehypePlugins={rehypePluginsList}
                                  components={markdownComponents}
                                  className="user_bot_message"
                                >
                                  {entry.message}
                                </Markdown>
                              )}
                            </Box>
                          )}
                        </Box>
                        {/* Copy button for user messages placed below the bubble */}
                        {entry.sender === "user" && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              width: "100%",
                              mt: 0.5,
                            }}
                          >
                            <Tooltip
                              title={copiedIndex === index ? "Copied!" : "Copy"}
                            >
                              <IconButtonField
                                size="small"
                                onClick={() =>
                                  handleCopyMessage(entry.message, index)
                                }
                                sx={{
                                  p: 1,
                                  backgroundColor: "#f3f4f6",
                                  borderRadius: "8px",
                                  "&:hover": { backgroundColor: "#e5e7eb" },
                                }}
                              >
                                {copiedIndex === index ? (
                                  <CheckIcon
                                    fontSize="small"
                                    sx={{ fontSize: "16px", color: "#4caf50" }}
                                  />
                                ) : (
                                  <ContentCopyIcon
                                    fontSize="small"
                                    sx={{ fontSize: "16px", color: "#333" }}
                                  />
                                )}
                              </IconButtonField>
                            </Tooltip>
                          </Box>
                        )}
                        {/* Feedback and TTS buttons for each bot response */}
                        {entry.sender === "bot" && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              width: "100%",
                              maxWidth: "85%",
                              gap: "4px",
                              mt: 1,
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              {feedbacks[index] !== "not_helpful" && (
                                <IconButtonField
                                  size="small"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backgroundColor:
                                      feedbacks[index] === "helpful"
                                        ? "#4caf50"
                                        : "#f3f4f6",
                                    color:
                                      feedbacks[index] === "helpful"
                                        ? "#fff"
                                        : "#333",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    px: "10px",
                                    py: "10px",
                                    boxShadow:
                                      feedbacks[index] === "helpful"
                                        ? "0 2px 8px rgba(76,175,80,0.12)"
                                        : "none",
                                    transition: "background 0.2s, color 0.2s",
                                    "&:hover": {
                                      backgroundColor: "#4caf50",
                                      color: "#fff",
                                      "& svg": {
                                        fill: "#fff !important",
                                      }
                                    },
                                  }}
                                  onClick={(e) =>
                                    handleFeedback(e, index, "helpful")
                                  }
                                >
                                  <ThumbUpOffAltIcon
                                    fontSize="small"
                                    sx={{
                                      color: "#333",
                                      fill:
                                        feedbacks[index] === "helpful"
                                          ? "#fff"
                                          : "none",
                                    }}
                                  />
                                </IconButtonField>
                              )}
                              {feedbacks[index] !== "helpful" && (
                                <IconButtonField
                                  size="small"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backgroundColor:
                                      feedbacks[index] === "not_helpful"
                                        ? "#f44336"
                                        : "#f3f4f6",
                                    color:
                                      feedbacks[index] === "not_helpful"
                                        ? "#fff"
                                        : "#333",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    px: "10px",
                                    py: "10px",
                                    boxShadow:
                                      feedbacks[index] === "not_helpful"
                                        ? "0 2px 8px rgba(244,67,54,0.12)"
                                        : "none",
                                    transition: "background 0.2s, color 0.2s",
                                    "&:hover": {
                                      backgroundColor: "#f44336",
                                      color: "#fff",
                                      "& svg": {
                                        fill: "#fff !important",
                                      }
                                    },
                                  }}
                                  onClick={(e) =>
                                    handleFeedback(e, index, "not_helpful")
                                  }
                                >
                                  <ThumbDownOffAltIcon
                                    fontSize="small"
                                    sx={{
                                      color: "#333",
                                      fill:
                                        feedbacks[index] === "not_helpful"
                                          ? "#fff"
                                          : "none",
                                    }}
                                  />
                                </IconButtonField>
                              )}
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {activeTTSIndex === index && isPlayingTTS ? (
                                <>
                                  {isPausedTTS ? (
                                    <Tooltip title="Resume Speech">
                                      <IconButtonField
                                        size="small"
                                        onClick={resumeTTS}
                                        sx={{
                                          p: "10px",
                                          backgroundColor: "#f3f4f6",
                                          borderRadius: "8px",
                                          "&:hover": {
                                            backgroundColor: "#e5e7eb",
                                          },
                                        }}
                                      >
                                        <PlayArrowIcon
                                          fontSize="small"
                                          sx={{ fontSize: "16px", color: "#333" }}
                                        />
                                      </IconButtonField>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Pause Speech">
                                      <IconButtonField
                                        size="small"
                                        onClick={pauseTTS}
                                        sx={{
                                          p: "10px",
                                          backgroundColor: "#f3f4f6",
                                          borderRadius: "8px",
                                          "&:hover": {
                                            backgroundColor: "#e5e7eb",
                                          },
                                        }}
                                      >
                                        <PauseIcon
                                          fontSize="small"
                                          sx={{ fontSize: "16px", color: "#333" }}
                                        />
                                      </IconButtonField>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Stop Speech">
                                    <IconButtonField
                                      size="small"
                                      onClick={stopTTS}
                                      sx={{
                                        p: "10px",
                                        backgroundColor: "#f3f4f6",
                                        borderRadius: "8px",
                                        "&:hover": { backgroundColor: "#e5e7eb" },
                                      }}
                                    >
                                      <StopIcon
                                        fontSize="small"
                                        sx={{
                                          fontSize: "16px",
                                          color: "#f44336",
                                        }}
                                      />
                                    </IconButtonField>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Read Aloud">
                                  <IconButtonField
                                    size="small"
                                    onClick={() =>
                                      speakMessage(entry.message, index)
                                    }
                                    sx={{
                                      p: "10px",
                                      backgroundColor: "#f3f4f6",
                                      borderRadius: "8px",
                                      "&:hover": { backgroundColor: "#e5e7eb" },
                                    }}
                                  >
                                    <VolumeUpIcon
                                      fontSize="small"
                                      sx={{ fontSize: "16px", color: "#333" }}
                                    />
                                  </IconButtonField>
                                </Tooltip>
                              )}
                              <Tooltip
                                title={copiedIndex === index ? "Copied!" : "Copy"}
                              >
                                <IconButtonField
                                  size="small"
                                  onClick={() =>
                                    handleCopyMessage(entry.message, index)
                                  }
                                  sx={{
                                    p: "10px",
                                    backgroundColor: "#f3f4f6",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#e5e7eb" },
                                  }}
                                >
                                  {copiedIndex === index ? (
                                    <CheckIcon
                                      fontSize="small"
                                      sx={{ fontSize: "16px", color: "#4caf50" }}
                                    />
                                  ) : (
                                    <ContentCopyIcon
                                      fontSize="small"
                                      sx={{ fontSize: "16px", color: "#333" }}
                                    />
                                  )}
                                </IconButtonField>
                              </Tooltip>
                              {index === chatHistory.length - 1 && !entry.alreadyTyped && speedUpIndex !== index && (
                                <Tooltip title="Speed Up">
                                  <IconButtonField
                                    className="chatWithelliot_lightning_speedup_btn"
                                    size="small"
                                    onClick={() => setSpeedUpIndex(index)}
                                    sx={{
                                      p: "10px",
                                      backgroundColor: "#f3f4f6",
                                      borderRadius: "8px",
                                      "&:hover": { backgroundColor: "#e5e7eb" },
                                    }}
                                  >
                                    <ZapIcon
                                      fontSize="small"
                                      sx={{ fontSize: "16px", color: "#333" }}
                                    />
                                  </IconButtonField>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                    {isLoadingActive && (
                      <Box
                        sx={{
                          mb: 2,
                          px: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "transparent",
                            borderRadius: "16px",
                            padding: 1.5,
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "80%",
                          }}
                        >
                          <RotatingTextLoader />
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </AnimatePresence>
            </div>

            {/* Jump to bottom button */}
            {showScrollBottom && !isVoicePanelOpen && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Tooltip title="Jump to bottom">
                  <IconButton
                    onClick={() => {
                      if (divRef.current) {
                        divRef.current.scrollTo({
                          top: divRef.current.scrollHeight,
                          behavior: "smooth",
                        });
                      }
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#6b7280",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      border: "1px solid #e5e7eb",
                      "&:hover": { backgroundColor: "#f9fafb", color: "#111827" },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#007bff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-anchor-icon lucide-anchor"
                    >
                      <path d="M12 6v16" />
                      <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
                      <path d="M9 11h6" />
                      <circle cx="12" cy="4" r="2" />
                    </svg>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          <div style={{ borderBottom: "1px solid #e0e0e0" }}></div>
          {/* Footer Input */}
          <footer
            className="chatbot_footer"
            style={{
              margin: "0 6%",
              padding: "16px 0",
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              width: "88%",
              alignSelf: "center",
            }}
          >
            {!isVoicePanelOpen && (
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ElliotFooterForm
                  className="elliot-footer-form-container"
                  methods={methods}
                  onSubmit={onSubmit}
                  formRef={formRef}
                  isListeningToInput={isListeningToInput}
                  stopInputSpeech={stopInputSpeech}
                  quotedText={quotedText}
                  setQuotedText={setQuotedText}
                  attachedFiles={attachedFiles}
                  setAttachedFiles={setAttachedFiles}
                  selectedScreens={selectedScreens}
                  setSelectedScreens={setSelectedScreens}
                  selectedExams={selectedExams}
                  setSelectedExams={setSelectedExams}
                  SCREENS={SCREENS}
                  EXAMS={EXAMS}
                  inputRef={inputRef}
                  fileInputRef={fileInputRef}
                  selectedAgent={selectedAgent}
                  setSelectedAgent={setSelectedAgent}
                  dbAgents={dbAgents}
                  handleToggleInputListening={handleToggleInputListening}
                  isLoadingActive={isLoadingActive}
                  handleOpenVoicePanel={handleOpenVoicePanel}
                />
              </Box>
            )}
            {!isVoicePanelOpen && (
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "13px",
                  textAlign: "center",
                  maxWidth: "600px",
                }}
              >
                Elliot can make mistakes. Check important info.
              </Typography>
            )}
          </footer>

          {/* Floating Ask Elliot Button for Text Selection */}
          {selectionRect && selectedText && (
            <Box
              sx={{
                position: "fixed",
                top: Math.max(0, selectionRect.top - 55),
                left: selectionRect.left + selectionRect.width / 2 - 65,
                zIndex: 9999,
                backgroundColor: "rgba(26, 26, 26, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "24px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(40, 40, 40, 0.95)",
                  transform: "translateY(-2px) scale(1.02)",
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.25)",
                },
              }}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent losing text selection focus
              }}
              onClick={() => {
                setQuotedText(selectedText);
                setSelectionRect(null);
                globalThis.getSelection()?.removeAllRanges();
                // Focus the input slightly later to let render finish
                setTimeout(() => {
                  if (inputRef.current) inputRef.current.focus();
                }, 50);
              }}
            >
              <FormatQuoteIcon fontSize="small" sx={{ color: "#009dff" }} />
              Ask Elliot
            </Box>
          )}

          {/* Search Dialog */}
          <ElliotSearchDialog
            className="elliot-search-dialog-container"
            open={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            setSessions={setSessions}
            setActiveSessionId={setActiveSessionId}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={Boolean(deleteSessionId)}
            onClose={() => setDeleteSessionId(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
                p: 3,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <DeleteOutlineIcon sx={{ color: "#ef4444", fontSize: "24px" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827", mb: 1 }}>
                Delete Chat
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", mb: 3 }}>
                Are you sure you want to delete the "{deleteSessionId ? (sessions.find((s) => s.id === deleteSessionId)?.title || "") : ""}"?
              </Typography>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setDeleteSessionId(null)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={async (e) => {
                    if (deleteSessionId) {
                      await handleDeleteSession(deleteSessionId, e as any);
                      setDeleteSessionId(null);
                    }
                  }}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#dc2626",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Dialog>

          {/* Chat Options Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => {
              setMenuAnchorEl(null);
              setActiveMenuSessionId(null);
            }}
            PaperProps /* NOSONAR */={{
              elevation: 3,
              sx: {
                minWidth: "150px",
                borderRadius: "8px",
                mt: 0.5,
                "& .MuiMenuItem-root": {
                  fontSize: "14px",
                  gap: 1.5,
                  padding: "8px 16px",
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {activeMenuSessionId && (() => {
              const s = sessions.find((x) => x.id === activeMenuSessionId);
              const isArchived = s?.isArchived;
              return [
                !isArchived && (
                  <MenuItem
                    key="pin"
                    onClick={() => handleTogglePin(activeMenuSessionId)}
                  >
                    <PushPinIcon fontSize="small" sx={{ color: "#6b7280" }} />
                    {s?.isPinned ? "Unpin Chat" : "Pin Chat"}
                  </MenuItem>
                ),
                !isArchived && (
                  <MenuItem
                    key="rename"
                    onClick={() => {
                      const id = activeMenuSessionId;
                      const title = s?.title || "";
                      setMenuAnchorEl(null);
                      setActiveMenuSessionId(null);
                      setTimeout(() => {
                        startRename(id, title);
                      }, 100);
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: "#6b7280" }} />
                    Rename
                  </MenuItem>
                ),
                <MenuItem
                  key="archive"
                  onClick={() => handleToggleArchive(activeMenuSessionId)}
                >
                  {isArchived ? (
                    <>
                      <UnarchiveIcon fontSize="small" sx={{ color: "#6b7280" }} />{" "}
                      Unarchive Chat
                    </>
                  ) : (
                    <>
                      <ArchiveIcon fontSize="small" sx={{ color: "#6b7280" }} />{" "}
                      Archive Chat
                    </>
                  )}
                </MenuItem>,
                <Divider key="div" sx={{ my: 0.5 }} />,
                <MenuItem
                  key="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteSessionId(activeMenuSessionId);
                    setMenuAnchorEl(null);
                  }}
                  sx={{ color: "#ef4444" }}
                >
                  <DeleteOutlineIcon fontSize="small" sx={{ color: "#ef4444" }} />
                  Delete
                </MenuItem>,
              ].filter(Boolean);
            })()}
          </Menu>
        </Box>
      </Box>
    );
  };

  export default ChatbotElliot;
