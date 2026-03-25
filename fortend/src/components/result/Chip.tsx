interface ChipProps {
  label: string;
  onRemove: () => void;
}

export default function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full px-2.5 py-0.5 text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors cursor-pointer"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}