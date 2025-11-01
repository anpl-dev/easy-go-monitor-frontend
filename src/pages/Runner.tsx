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

type Runner = {
  id: string;
  name: string;
  region: string;
  interval_second: number;
  is_enabled: boolean;
  monitor_id: string;
};

type RunnerInput = {
  name: string;
  region: string;
  interval_second: number;
  monitor_id: string;
};

const label = tv({
  base: "block text-sm font-meduim text-gray-700 mb-1",
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

export default function Runner() {
  const { user } = useUser();
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [newRunner, setNewRunner] = useState<RunnerInput>({
    name: "",
    region: "",
    interval_second: 60,
    monitor_id: "",
  });
  const [editingRunnerID, setEditingRunnerID] = useState<string | null>(null);
  const [editData, setEditData] = useState<RunnerInput>({
    name: "",
    region: "",
    interval_second: 60,
    monitor_id: "",
  });

  const fetchRunners = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_ENDPOINTS.RUNNERS}?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);
      setRunners(jsonData.data || []);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("サーバーに接続できませんでした");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRunners();
  }, [fetchRunners]);

  const handleAddRunner = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    try {
      const res = await fetch(API_ENDPOINTS.RUNNERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRunner),
      });

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      await fetchRunners();
      setOpen(false);
      setNewRunner({
        name: "",
        region: "",
        interval_second: 60,
        monitor_id: "",
      });
      toast.success("Runnerを作成しました");
    } catch {
      toast.error("作成中にエラーが発生しました");
    }
  };

  const handleUpdateRunner = async (id: string, data: RunnerInput) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.RUNNERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      await fetchRunners();
      toast.success("Runnerを更新しました");
      setEditingRunnerID(null);
    } catch {
      toast.error("更新中にエラーが発生しました");
    }
  };

  const handleDeleteRunner = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm("このRunnerを削除してもよろしいですか？")) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.RUNNERS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204) {
        const jsonData = await res.json();
        if (!res.ok) throw new Error(jsonData.message);
      }
      await fetchRunners();
      toast.success("Runnerを削除しました");
    } catch {
      toast.error("削除中にエラーが発生しました");
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={
        <Header title="Runners">
          <div className="relative w-72">
            <input
              type="search"
              id="search"
              placeholder="検索(Mock)"
              className={cn(searchInput())}
              onChange={(e) => console.log("検索:", e.target.value)}
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
          <h2 className="text-xl font-semibold">登録済みモニター実行環境</h2>

          {/* モーダル： 新規Runner追加 */}
          <Modal open={open} title="新規Runner追加">
            <form onSubmit={handleAddRunner} className="space-y-3">
              <label className={cn(label())}>Runner名</label>
              <input
                type="text"
                className={cn(input())}
                value={newRunner.name}
                onChange={(e) =>
                  setNewRunner((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <label className={cn(label())}>Region</label>
              <input
                type="text"
                className={cn(input())}
                value={newRunner.region}
                onChange={(e) =>
                  setNewRunner((prev) => ({ ...prev, region: e.target.value }))
                }
                required
              />
              <label className={cn(label())}>Interval (秒)</label>
              <input
                type="number"
                className={cn(input())}
                value={newRunner.interval_second}
                onChange={(e) =>
                  setNewRunner((prev) => ({
                    ...prev,
                    interval_second: Number(e.target.value),
                  }))
                }
              />
              <label className={cn(label())}>Monitor ID</label>
              <input
                type="text"
                className={cn(input())}
                value={newRunner.monitor_id}
                onChange={(e) =>
                  setNewRunner((prev) => ({
                    ...prev,
                    monitor_id: e.target.value,
                  }))
                }
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

          {loading ? (
            <p className="text-gray-500">読み込み中...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : runners.length === 0 ? (
            <p className="text-gray-500">Runnerが未登録です</p>
          ) : (
            <ul className="divide-y divide-gray-300 bg-white rounded-md border border-gray-300">
              {runners.map((r) => (
                <li key={r.id} className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <p className="text-sm text-gray-600">
                        Region: {r.region}
                      </p>
                      <p className="text-xs text-gray-400">
                        Interval: {r.interval_second}s
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          r.is_enabled ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {r.is_enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        intent="secondary"
                        onClick={() => {
                          if (editingRunnerID === r.id) {
                            setEditingRunnerID(null);
                          } else {
                            setEditingRunnerID(r.id);
                            setEditData({
                              name: r.name,
                              region: r.region,
                              interval_second: r.interval_second,
                              monitor_id: r.monitor_id,
                            });
                          }
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        intent="danger"
                        onClick={() => handleDeleteRunner(r.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>

                  {/* 編集フォーム */}
                  {editingRunnerID === r.id && (
                    <div className="mt-4 bg-white p-4 rounded-md space-y-3 border border-gray-300">
                      <label className={cn(label())}>Runner名</label>
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
                      <label className={cn(label())}>Region</label>
                      <input
                        type="text"
                        value={editData.region}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            region: e.target.value,
                          }))
                        }
                        className={cn(input())}
                      />
                      <label className={cn(label())}>Interval (秒)</label>
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
                      <label className={cn(label())}>Monitor ID</label>
                      <input
                        type="text"
                        value={editData.monitor_id}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            monitor_id: e.target.value,
                          }))
                        }
                        className={cn(input())}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          intent="secondary"
                          onClick={() => setEditingRunnerID(null)}
                        >
                          キャンセル
                        </Button>
                        <Button
                          intent="primary"
                          onClick={() => handleUpdateRunner(r.id, editData)}
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
