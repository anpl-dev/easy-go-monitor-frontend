import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Home, BarChart3, Settings, Play, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebar = tv({
  base: "flex flex-col h-full",
});

const navItem = tv({
  base: "flex px-5 py-5 items-center gap-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer",
  variants: {
    active: {
      true: "bg-blue-100 text-blue-700 font-semibold",
      false: "",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export default function Sidebar() {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Monitors", path: "/monitors", icon: BarChart3 },
    { label: "Runners", path: "/runners", icon: Play },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const user = {
    name: "User1",
  };

  return (
    <aside className={cn(sidebar())}>
      {/* Header: ユーザ情報 */}
      <div className="flex gap-3 space-y-10 bg-white">
        <div className="rounded-full bg-gray-300">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="text-gray-600">{user.name}</div>
      </div>

      {/* ナビゲーションリスト */}
      <nav className="flex-1 flex-col space-y-3">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end className="block">
            {({ isActive }) => (
              <div className={cn(navItem({ active: isActive }))}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: システム情報 */}
      <div className="border-t border-gray-300 px-4 py-3 text-sm text-gray-500 ">
        v1.0.0
      </div>
    </aside>
  );
}
