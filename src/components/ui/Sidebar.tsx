import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Home, BarChart3, Settings, Play, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { VERSION } from "../../constants/config";

const sidebar = tv({
  base: "flex flex-col h-full",
});

const navItem = tv({
  base: "flex px-6 py-5 items-center gap-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer",
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

  const { user } = useUser();
  if (!user) return "unknown name";

  return (
    <aside className={cn(sidebar())}>
      {/* Header: ユーザ情報 */}
      <div className="w-full flex items-center mb-8 mt-2">
        <div className="flex gap-3 space-y-10">
          <div className="rounded-full border bg-gray-200">
            <User className="w-7 h-7 text-gray-600" />
          </div>
          <div className="w-7 h-7 text-gray-600 text-xl">{user.name}</div>
        </div>
      </div>

      {/* ナビゲーションリスト */}
      <nav className="w-full flex-1 flex-col space-y-1">
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
        {VERSION}
      </div>
    </aside>
  );
}
