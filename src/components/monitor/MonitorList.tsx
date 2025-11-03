import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";
import type { Monitor, MonitorUpdateInput } from "../../type/monitor";

const label = tv({ base: "block text-sm font-medium text-gray-700 mb-1" });

type MonitorListProps = {
  monitors: Monitor[];
  editingMonitorID: string | null;
  editData: MonitorUpdateInput;
  setEditData: React.Dispatch<React.SetStateAction<MonitorUpdateInput>>;
  onEditClick: (id: string, monitor: Monitor) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isEnabled: boolean) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  renderSettingsForm: (monitor: Monitor) => React.ReactNode;
};

export function MonitorList({
  monitors,
  editingMonitorID,
  onEditClick,
  onDelete,
  onToggle,
  onSave,
  onCancel,
  renderSettingsForm,
}: MonitorListProps) {
  if (!monitors.length)
    return <p className="text-gray-500">モニターが未登録です</p>;

  return (
    <ul className="bg-white rounded-md border border-gray-400">
      {monitors.map((m) => (
        <li key={m.id} className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{m.name}</p>
              <p className="text-sm text-gray-600">{m.url}</p>
              <p className="text-xs text-gray-400">
                Type: {m.type} / {m.is_enabled ? "有効" : "無効"}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <ToggleSwitch
                checked={m.is_enabled}
                onChange={(val) => onToggle(m.id, val)}
              />
              <Button intent="secondary" onClick={() => onEditClick(m.id, m)}>
                編集
              </Button>
              <Button intent="danger" onClick={() => onDelete(m.id)}>
                削除
              </Button>
            </div>
          </div>

          {editingMonitorID === m.id && (
            <div className="mt-4 bg-white p-4 rounded-md space-y-3 border border-gray-300">
              <label className={cn(label())}>タイプ: {m.type}</label>
              {renderSettingsForm(m)}
              <div className="flex justify-end gap-2 mt-3">
                <Button intent="secondary" onClick={onCancel}>
                  キャンセル
                </Button>
                <Button intent="primary" onClick={() => onSave(m.id)}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
