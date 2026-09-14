import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  Flame,
  Flower2,
  Focus,
  GraduationCap,
  Hand,
  Home,
  Keyboard,
  Layers3,
  Leaf,
  LockKeyhole,
  Map,
  Moon,
  MoveUp,
  Play,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Trophy,
  Waves,
  Wind,
  X,
  Hash,
  Quote,
  Flag,
  ChartNoAxesCombined,
  Download,
  Upload,
  Pause,
  Eye,
  EyeOff,
  CircleHelp,
  CircleAlert,
  Menu,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export type Page =
  "home" | "course" | "practice" | "progress" | "guide" | "settings";
import { useEffect, useRef, type RefObject } from "react";
export const icons: Record<string, LucideIcon> = {
  arrow: MoveUp,
  home: Home,
  book: BookOpen,
  keyboard: Keyboard,
  chart: ChartNoAxesCombined,
  settings: Settings2,
  leaf: Leaf,
  sprout: Sprout,
  flower: Flower2,
  layers: Layers3,
  map: Map,
  shift: MoveUp,
  quote: Quote,
  numbers: Hash,
  wave: Waves,
  wind: Wind,
  flag: Flag,
  right: ArrowRight,
  chevron: ChevronRight,
  down: ChevronDown,
  check: Check,
  clock: Clock3,
  coffee: Coffee,
  flame: Flame,
  focus: Focus,
  graduate: GraduationCap,
  hand: Hand,
  lock: LockKeyhole,
  moon: Moon,
  sun: Sun,
  play: Play,
  repeat: RotateCcw,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  trophy: Trophy,
  close: X,
  download: Download,
  upload: Upload,
  pause: Pause,
  eye: Eye,
  hidden: EyeOff,
  help: CircleHelp,
  alert: CircleAlert,
  menu: Menu,
};
export function Icon({
  name,
  size = 20,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = icons[name] ?? Sparkles;
  return (
    <Component size={size} strokeWidth={1.7} aria-hidden="true" {...props} />
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="hand" size={25} />
      </span>
      {!compact && (
        <span>
          onparmak<span className="brand-dot">.</span>
        </span>
      )}
    </div>
  );
}
export function ProgressRing({
  value,
  size = 76,
  children,
}: {
  value: number;
  size?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="34" />
        <circle
          cx="40"
          cy="40"
          r="34"
          strokeDasharray={`${Math.min(100, value) * 2.136} 213.6`}
        />
      </svg>
      <div>{children}</div>
    </div>
  );
}
export function useDialogFocus(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const previous = document.activeElement as HTMLElement | null;
    const siblings = Array.from(root.parentElement?.children ?? [])
      .filter(
        (node): node is HTMLElement =>
          node instanceof HTMLElement && node !== root,
      )
      .map((node) => ({ node, inert: node.inert }));
    for (const { node } of siblings) node.inert = true;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        ),
      ).filter(
        (node) =>
          !(node as HTMLButtonElement).disabled &&
          node.getClientRects().length > 0,
      );
    controls()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = controls(),
        first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    root.addEventListener("keydown", trap);
    return () => {
      root.removeEventListener("keydown", trap);
      for (const { node, inert } of siblings) node.inert = inert;
      document.body.style.overflow = overflow;
      if (previous && document.contains(previous))
        previous.focus({ preventScroll: true });
    };
  }, [ref]);
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useDialogFocus(root);
  return (
    <div ref={root} className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <button
          className="icon-button modal-close"
          aria-label="Kapat"
          onClick={onClose}
          autoFocus
        >
          <Icon name="close" />
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
export const number = (n: number, digits = 0) =>
  n.toLocaleString("tr-TR", { maximumFractionDigits: digits });
export const durationLabel = (ms: number) =>
  `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">
          <span className="little-line" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function MetricCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: string;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="metric-card">
      <span className="metric-label">
        <Icon name={icon} size={18} />
        {label}
      </span>
      <strong>
        {value}
        <small>{suffix}</small>
      </strong>
    </div>
  );
}
