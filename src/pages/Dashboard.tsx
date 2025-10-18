import DefaultLayout from "../components/layout/DefaultLayout";
import { Header } from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";

export default function Dashboard() {
  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={<Header title="Dashboard" />}
      main={
        <div className="space-y-4">
          {/* アラート情報 */}
          <div className="bg-white p-6 rounded-md border border-gray-300">
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
