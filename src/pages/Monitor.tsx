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

type Monitor = {
  id: string;
  name: string;
  url: string;
  interval_second: number;
};

type MonitorUpdateInput = {
  name: string;
  url: string;
  interval_second: number;
};

const label = tv({
  base: "block text-sm font-meduim text-gray-700 mb-1",
});

const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
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
    interval_second: 60,
  });
  const [editingMonitorID, setEditingMonitorID] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    url: "",
    interval_second: 60,
  });

  const monitorInput = tv({
    base: "border p-2 w-full rounded",
  });

  const fetchMonitors = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${API_ENDPOINTS.MONITORS}/search?user_id=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      setMonitors(jsonData.data || []);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Failed to connecting server");
      } else if (err instanceof Error) {
        setError("Unexpected Error");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 初回実行
  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

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
          interval_second: newMonitor.interval_second,
        }),
      });

      const jsonData = await res.json();
      if (!res.ok) {
        throw new Error(jsonData.message);
      }

      // モニター取得
      await fetchMonitors();

      // モーダルを閉じる
      setOpen(false);

      // 入力フォームリセット
      setNewMonitor({
        name: "",
        url: "",
        interval_second: 60,
      });
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Internal Server Erorr");
      } else if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleUpdateMonitor = async (id: string, data: MonitorUpdateInput) => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          url: data.url,
          interval_second: data.interval_second,
        }),
      });
      const jsonData = await res.json();
      if (!res.ok) {
        throw new Error(jsonData.message);
      }

      await fetchMonitors();

      setEditingMonitorID(null);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Internal Server Erorr");
      } else if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={<Header title="Monitors" />}
      main={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">登録済みモニター</h2>
            <Button intent="primary" onClick={() => setOpen(true)}>
              + 新規追加
            </Button>

            {/* モーダル： 新規モニター追加 */}
            <Modal open={open} title="新規モニター追加">
              <form onSubmit={handleAddMonitor} className="space-y-3">
                <input
                  type="text"
                  placeholder="モニター名"
                  className={cn(monitorInput())}
                  value={newMonitor.name}
                  onChange={(e) => {
                    setNewMonitor((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  required
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  className={cn(monitorInput())}
                  value={newMonitor.url}
                  onChange={(e) => {
                    setNewMonitor((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }));
                  }}
                  required
                />
                <input
                  type="number"
                  placeholder="監視間隔(秒)"
                  className={cn(monitorInput())}
                  value={newMonitor.interval_second}
                  onChange={(e) => {
                    setNewMonitor((prev) => ({
                      ...prev,
                      interval_second: Number(e.target.value),
                    }));
                  }}
                  required
                />
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
          </div>
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
                  {/* 上部（タイトルとボタン） */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{m.name}</p>
                      <p className="text-sm text-gray-600">{m.url}</p>
                      <p className="text-xs text-gray-400">
                        Interval: {m.interval_second}s
                      </p>
                    </div>
                    <div className="flex gap-2">
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
                              interval_second: m.interval_second,
                            });
                          }
                        }}
                      >
                        編集
                      </Button>
                      <Button intent="danger">削除</Button>
                    </div>
                  </div>

                  {/* 下部（フォーム） */}
                  {editingMonitorID === m.id && (
                    <div className="mt-4 bg-white p-4 rounded-md space-y-3 border border-gray-300">
                      <label className={cn(label())}>モニター名</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={cn(input())}
                      />
                      <label className={cn(label())}>URL</label>
                      <input
                        type="url"
                        value={editData.url}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        className={cn(input())}
                      />
                      <label className={cn(label())}>監視間隔(秒)</label>
                      <input
                        type="number"
                        value={editData.interval_second}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            interval_second: Number(e.target.value),
                          }))
                        }
                        className={cn(input())}
                      />
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
