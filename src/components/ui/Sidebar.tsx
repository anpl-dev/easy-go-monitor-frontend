import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Home, BarChart3, Settings, Play } from "lucide-react";

const sidebar = tv({
  base: "flex flex-col h-full bg-white border-gray-400",
});

const navItem = tv({
  base: "flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer",
  variants: {
    active: {
      true: "bg-blue-100 text-blue-100 font-medium",
    },
  },
  defaultVariants: {
    active: false,
  },
});

type SidebarProps = {
  active?: string;
  onNavigate?: (path: string) => void;
};

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Monitors", icon: BarChart3, path: "/monitors" },
    { label: "Runners", icon: Play, path: "/runners" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className={cn(sidebar())}>
      {/* Header: ロゴ部分 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-lg fond-blod text-blue-600 tracking-tight">
          Go Monitor
        </h1>
      </div>

      {/* ナビゲーションリスト */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(navItem({ active: active === item.path }))}
              onClick={() => onNavigate?.(item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer: ユーザー情報 */}
      <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500 ">
        v1.0.0
      </div>
    </aside>
  );
}
