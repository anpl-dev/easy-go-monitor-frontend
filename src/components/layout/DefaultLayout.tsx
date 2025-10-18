import React from "react";

type DefaultLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
};

export default function DefaultLayout({
  sidebar,
  header,
  main,
}: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <aside className="w-64 bg-white p-4 border-r border-gray-300">
        {sidebar}
      </aside>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-300">{header}</header>
        {/* メインコンテンツ */}
        <main className="flex-1  bg-gray-50 overflow-y-auto p-8 border-gray-200">
          {main}
        </main>
      </div>
    </div>
  );
}
