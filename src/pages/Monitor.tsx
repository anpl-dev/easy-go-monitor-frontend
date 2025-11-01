import { useCallback, useEffect, useState } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import Sidebar from "../components/ui/Sidebar";
import { Header } from "../components/ui/Header";
import { Button } from "../components/ui/Button";
import { API_ENDPOINTS } from "../constants/api";
import { useUser } from "../hooks/useUser";
import { tv } from "tailwind-variants";
import { Modal } from "../components/ui/Modal";
import { cn } from "../lib/utils";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { SettingsFormHTTP } from "../components/monitor/SettingsFormHTTP";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

type Monitor = {
  id: string;
  name: string;
  url: string;
  type: string;
  settings: Record<string, unknown>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

type MonitorUpdateInput = {
  name: string;
  url: string;
  type: string;
  settings: Record<string, unknown>;
  is_enabled: boolean;
};

const label = tv({
  base: "block text-sm font-medium text-gray-700 mb-1",
});

const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
});

const searchLabel = tv({
  base: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-text peer-focus:text-gray-500 transition-colors",
});

const searchInput = tv({
  base: "peer pl-10 pr-3 py-2 w-full bg-gray-100 border border-gray-400 rounded-md focus:bg-white focus:ring-blue-400 text-gray-800 focus:outline-none",
});

export default function Monitor() {
  const { user } = useUser();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [newMonitor, setNewMonitor] = useState({
    name: "",
    url: "",
    type: "http",
  });

  const [editingMonitorID, setEditingMonitorID] = useState<string | null>(null);
  const [editData, setEditData] = useState<MonitorUpdateInput>({
    name: "",
    url: "",
    type: "http",
    settings: {},
    is_enabled: true,
  });

  const fetchMonitors = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_ENDPOINTS.MONITORS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      setMonitors(jsonData.data || []);
    } catch {
      setError("モニター情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_ENDPOINTS.MONITORS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newMonitor.name,
          url: newMonitor.url,
          type: newMonitor.type,
        }),
      });

      const jsonData = await res.json();
      if (!res.ok) {
        // --- サーバーメッセージ分岐 ---
        toast.error(`Error: ${jsonData.message ?? "不明なエラー"}`);
        return;
      }

      await fetchMonitors();
      setOpen(false);
      setNewMonitor({ name: "", url: "", type: "http" });
      toast.success("モニターを作成しました");
    } catch (err) {
      console.error(err);
      toast.error("通信中にエラーが発生しました");
    }
  };

  const handleUpdateMonitor = async (id: string, data: MonitorUpdateInput) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      await fetchMonitors();
      setEditingMonitorID(null);
      toast.success("モニターを更新しました");
    } catch {
      toast.error("更新中にエラーが発生しました");
    }
  };

  const handleDeleteMonitor = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm("このモニターを削除してもよろしいですか？")) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204) {
        const jsonData = await res.json();
        if (!res.ok) throw new Error(jsonData.message);
      }

      await fetchMonitors();
      toast.success("モニターを削除しました");
    } catch {
      toast.error("削除中にエラーが発生しました");
    }
  };

  const handleToggleMonitor = async (id: string, isEnabled: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}/enabled`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_enabled: isEnabled,
        }),
      });

      if (!res.ok) {
        const jsonData = await res.json();
        throw new Error(jsonData.message);
      }
      setMonitors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_enabled: isEnabled } : m))
      );

      toast.success(
        isEnabled ? "モニターを有効化しました" : "モニターを無効化しました"
      );
      fetchMonitors();
    } catch {
      toast.error("状態の変更に失敗しました");
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={
        <Header title="Monitors">
          <div className="relative w-72">
            <input
              type="search"
              id="search"
              placeholder="検索(Mock)"
              className={cn(searchInput())}
            />
            <label htmlFor="search" className={cn(searchLabel())}>
              <Search className="w-5 h-5" />
            </label>
          </div>
          <Button intent="primary" onClick={() => setOpen(true)}>
            + 新規追加
          </Button>
        </Header>
      }
      main={
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">登録済みモニター</h2>

          <Modal open={open} title="新規モニター追加">
            <form onSubmit={handleAddMonitor} className="space-y-3">
              <label className={cn(label())}>モニター名</label>
              <input
                type="text"
                className={cn(input())}
                value={newMonitor.name}
                onChange={(e) =>
                  setNewMonitor((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <label className={cn(label())}>URL</label>
              <input
                type="url"
                className={cn(input())}
                value={newMonitor.url}
                onChange={(e) =>
                  setNewMonitor((prev) => ({ ...prev, url: e.target.value }))
                }
                required
              />
              <label className={cn(label())}>タイプ</label>
              <select
                className={cn(input())}
                value={newMonitor.type}
                onChange={(e) =>
                  setNewMonitor((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="http">HTTP</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <Button intent="secondary" onClick={() => setOpen(false)}>
                  キャンセル
                </Button>
                <Button intent="primary" type="submit">
                  保存
                </Button>
              </div>
            </form>
          </Modal>

          {loading ? (
            <p className="text-gray-500">読み込み中...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : monitors.length === 0 ? (
            <p className="text-gray-500">モニターが未登録です</p>
          ) : (
            <ul className="divide-y divide-gray-300 bg-white rounded-md border border-gray-300">
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
                        onChange={(val) => handleToggleMonitor(m.id, val)}
                      />
                      <Button
                        intent="secondary"
                        onClick={() => {
                          if (editingMonitorID === m.id) {
                            setEditingMonitorID(null);
                          } else {
                            setEditingMonitorID(m.id);
                            setEditData({
                              name: m.name,
                              url: m.url,
                              type: m.type,
                              settings: m.settings || {},
                              is_enabled: m.is_enabled,
                            });
                          }
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        intent="danger"
                        onClick={() => handleDeleteMonitor(m.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>

                  {editingMonitorID === m.id && (
                    <div className="mt-4 bg-white p-4 rounded-md space-y-3 border border-gray-300">
                      <label className={cn(label())}>タイプ: {m.type}</label>
                      {m.type === "http" && (
                        <SettingsFormHTTP
                          value={editData.settings}
                          onChange={(v) =>
                            setEditData((prev) => ({
                              ...prev,
                              settings: v,
                            }))
                          }
                        />
                      )}
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          intent="secondary"
                          onClick={() => setEditingMonitorID(null)}
                        >
                          キャンセル
                        </Button>
                        <Button
                          intent="primary"
                          onClick={() => handleUpdateMonitor(m.id, editData)}
                        >
                          保存
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
