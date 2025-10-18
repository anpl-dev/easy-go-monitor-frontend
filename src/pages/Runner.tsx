import DashboardLayout from "../components/layout/DashboardLayout";
import Sidebar from "../components/ui/Sidebar";
import { Header } from "../components/ui/Header";
import { Button } from "../components/ui/Button";
import { useState } from "react";

export default function Runner() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRun = () => {
    setRunning(true);
    setLogs((prev) => [...prev, "モニターを実行中..."]);
    setTimeout(() => {
      setRunning(false);
      setLogs((prev) => [...prev, "実行完了 (mock)"]);
    }, 2000);
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar active="/runner" />}
      header={<Header title="Runner" />}
      main={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Monitor Runner</h2>
            <Button
              intent={running ? "danger" : "primary"}
              onClick={handleRun}
              disabled={running}
            >
              {running ? "停止中..." : "実行"}
            </Button>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">ログ</h3>
            <div className="bg-gray-500 rounded p-3 h-48 overflow-y-auto text-sm text-gray-700">
              {logs.length === 0 ? (
                <p className="text-gray-400">実行ログがありません</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className="border-b border-gray-100 py-1">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
