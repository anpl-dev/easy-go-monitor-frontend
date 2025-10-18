import React from "react";

type DashboardLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
};

export default function DashboardLayout({
  sidebar,
  header,
  main,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <aside className="w-64 bg-white shadow-md p-4 border-r border-gray-200">
        {sidebar}
      </aside>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          {header}
        </header>
        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto p-8">{main}</main>
      </div>
    </div>
  );
}
