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
          <h2 className="text-xl font-semibold">アラート情報</h2>
          <div className="bg-white p-6 rounded-md border border-gray-300">
            <p className="text-gray-600">
              現在アクティブなアラートはありません。
            </p>
          </div>
        </div>
      }
    />
  );
}
