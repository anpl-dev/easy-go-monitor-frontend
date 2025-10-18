import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

const header = tv({
  base: "flex items-center justify-between w-full px-6 py-8 bg-white",
});

type HeaderProps = {
  title?: string;
};

export function Header({ title = "Dashboard" }: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <header className={cn(header())}>
      {/* 左側: ページタイトル */}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* 右側: 操作ボタン */}
      <div className="flex items-center gap-3">
        <Button intent="danger" size="smh" onClick={handleLogout}>
          ログアウト
        </Button>
      </div>
    </header>
  );
}
