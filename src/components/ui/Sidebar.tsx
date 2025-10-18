import { useEffect, useState } from "react";
import { Button } from "./Button";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  user_id: string;
};

type Monitor = {
  id: string;
  name: string;
  url: string;
  interval_second: number;
};

export default function Sidebar() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("ログイン情報がありません");
      return;
    }

    let userId = "";
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.user_id;
    } catch {
      setError("トークンが不正です");
      return;
    }

    //モニター一覧取得
    fetch(`http://localhost:8080/api/v1/monitors/search?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "取得に失敗しました");
        setMonitors(data.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoding(false));
  }, []);

  if (loading) return <div className="p-4 text-gray-500">読み込み中...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <aside className="bg-white border-r p-4 flex flex-col">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-4">Test Monitors</h2>
        <div className="flex gap-2 mb-6">
          <Button intent="primary" size="sm">
            追加
          </Button>
          <Button intent="secondary" size="sm">
            設定
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {monitors.map((m) => (
            <div
              key={m.id}
              className="p-2 rounded hover:bg-gray-100 cursor-pointer transition"
            >
              <p className="font-medium text-gray-800">{m.name}</p>
              <p className="text-sm text-gray-500 trancate">{m.url}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
