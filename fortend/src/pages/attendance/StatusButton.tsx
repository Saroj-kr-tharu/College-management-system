export function StatusButton({
  label,
  color,
  active,
  disabled,
  onClick
}: {
  label: string;
  color: 'green' | 'red' | 'yellow';
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const base = 'px-4 py-1.5 rounded-lg text-sm font-medium border transition';

  const styles = {
    green: active
      ? 'bg-green-600 text-white border-green-600'
      : 'border-green-500 text-green-600 hover:bg-green-50',
    red: active
      ? 'bg-red-600 text-white border-red-600'
      : 'border-red-500 text-red-600 hover:bg-red-50',
    yellow: active
      ? 'bg-yellow-500 text-white border-yellow-500'
      : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[color]} disabled:opacity-50`}
    >
      {label}
    </button>
  );
}
