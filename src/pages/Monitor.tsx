import { useEffect, useState } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import Sidebar from "../components/ui/Sidebar";
import { Header } from "../components/ui/Header";
import { Button } from "../components/ui/Button";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../constants/api";

type Monitor = {
  id: string;
  name: string;
  url: string;
  interval_second: number;
};

export default function Monitor() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<{ user_id: string }>(token);
    const userID = decoded.user_id;

    fetch(`${API_ENDPOINTS.MONITORS}/search?user_id=${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetching monitors");
        setMonitors(data.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={<Header title="Monitors" />}
      main={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">登録済みモニター</h2>
            <Button intent="primary">+ 新規追加</Button>
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
                <li
                  key={m.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.url}</p>
                    <p className="text-xs text-gray-400">
                      Interval: {m.interval_second}s
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button intent="secondary">編集</Button>
                    <Button intent="danger">削除</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
