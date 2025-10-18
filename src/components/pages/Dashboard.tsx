import DashboardLayout from "../layout/DashboardLayout";
import { Button } from "../ui/Button";
import { Header } from "../ui/Header";
import Sidebar from "../ui/Sidebar";

export default function Dashboard() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={<Header title="Monitor Dashboard" />}
      main={
        <div className="space-y-6">
          {/* 操作用ボタン */}
          <div className="flex justify-end gap-4">
            <Button intent="primary">Run</Button>
            <Button intent="danger">Stop</Button>
          </div>

          {/* アラート情報 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Alert</h2>
            <p className="text-gray-600">
              現在アクティブなアラートはありません。
            </p>
          </div>
        </div>
      }
    />
  );
}
