import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  user_id: string;
  exp: number;
  iat: number;
};

type Monitor = {
  id: string;
  name: string;
  url: string;
  interval_second: number;
};

export default function Dashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [error, setError] = useState("");
  const [newMonitor, setNewMonitor] = useState({
    name: "",
    url: "",
    interval_second: 60,
  });
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const navigate = useNavigate();

  // ✅ 初回ロード：JWT解析＋一覧取得
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    let userID = "";
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userID = decoded.user_id;
    } catch {
      setError("トークンが不正です。再ログインしてください。");
      return;
    }

    fetch(`http://localhost:8080/api/v1/monitors/search?user_id=${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMonitors(data.data || []);
      })
      .catch((err) => setError(err.message));
  }, [navigate]);

  // ✅ 登録・更新共通
  const handleAddOrUpdateMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const method = selectedMonitor ? "PUT" : "POST";
      const url = selectedMonitor
        ? `http://localhost:8080/api/v1/monitors/${selectedMonitor.id}`
        : "http://localhost:8080/api/v1/monitors";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newMonitor.name,
          url: newMonitor.url,
          interval_second: Number(newMonitor.interval_second),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (selectedMonitor) {
        // 編集の場合は既存リストを更新
        setMonitors((prev) =>
          prev.map((m) => (m.id === selectedMonitor.id ? data.data : m))
        );
        setSelectedMonitor(null);
      } else {
        // 新規追加
        setMonitors((prev) => [...prev, data.data]);
      }

      setNewMonitor({ name: "", url: "", interval_second: 60 });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ 編集ボタン押下時
  const handleEditMonitor = (monitor: Monitor) => {
    setSelectedMonitor(monitor);
    setNewMonitor({
      name: monitor.name,
      url: monitor.url,
      interval_second: monitor.interval_second,
    });
  };

  // ✅ 削除処理
  const handleDeleteMonitor = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/monitors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "削除に失敗しました");
      }

      setMonitors((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">📊 Monitor Dashboard</h1>

      {/* 🆕 モニター追加/編集フォーム */}
      <form
        onSubmit={handleAddOrUpdateMonitor}
        className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">
          {selectedMonitor ? "✏️ モニターを編集" : "🆕 新規モニターを追加"}
        </h2>

        <input
          type="text"
          placeholder="モニター名"
          value={newMonitor.name}
          onChange={(e) =>
            setNewMonitor({ ...newMonitor, name: e.target.value })
          }
          className="border p-2 w-full rounded mb-3"
          required
        />
        <input
          type="url"
          placeholder="URL (例: https://example.com)"
          value={newMonitor.url}
          onChange={(e) =>
            setNewMonitor({ ...newMonitor, url: e.target.value })
          }
          className="border p-2 w-full rounded mb-3"
          required
        />
        <input
          type="number"
          placeholder="監視間隔(秒)"
          value={newMonitor.interval_second}
          onChange={(e) =>
            setNewMonitor({
              ...newMonitor,
              interval_second: Number(e.target.value),
            })
          }
          className="border p-2 w-full rounded mb-4"
          min={10}
          required
        />

        <button
          type="submit"
          className={`${
            selectedMonitor
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-2 px-4 rounded w-full`}
        >
          {selectedMonitor ? "更新" : "登録"}
        </button>

        {selectedMonitor && (
          <button
            type="button"
            onClick={() => {
              setSelectedMonitor(null);
              setNewMonitor({ name: "", url: "", interval_second: 60 });
            }}
            className="mt-2 bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded w-full"
          >
            キャンセル
          </button>
        )}
      </form>

      {/* 📋 モニター一覧 */}
      <div className="w-full max-w-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {monitors.length === 0 ? (
          <p className="text-gray-600 text-center">
            モニターはまだ登録されていません。
          </p>
        ) : (
          <ul>
            {monitors.map((m) => (
              <li
                key={m.id}
                className="bg-white shadow rounded-lg p-4 mb-3 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold">{m.name}</h2>
                <p className="text-gray-700">{m.url}</p>
                <p className="text-sm text-gray-500 mb-3">
                  Interval: {m.interval_second}s
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMonitor(m)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteMonitor(m.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        ログアウト
      </button>
    </div>
  );
}