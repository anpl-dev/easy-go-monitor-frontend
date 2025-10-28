import { cn } from "../../lib/utils";
import { tv } from "tailwind-variants";

const label = tv({
  base: "block text-sm font-medium text-gray-700 mb-1",
});
const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
});

type Props = {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
};

export function SettingsFormPing({ value, onChange }: Props) {
  const handleChange = (key: string, val: string | number) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-3">
      <label className={cn(label())}>Ping回数</label>
      <input
        type="number"
        className={cn(input())}
        value={value.count ?? 4}
        onChange={(e) => handleChange("count", Number(e.target.value))}
      />

      <label className={cn(label())}>タイムアウト（秒）</label>
      <input
        type="number"
        className={cn(input())}
        value={value.timeout ?? 3}
        onChange={(e) => handleChange("timeout", Number(e.target.value))}
      />
    </div>
  );
}
