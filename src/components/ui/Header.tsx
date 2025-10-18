import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

const header = tv({
  base: "flex items-center justify-between w-full px-6 py-4 border-b bg-white shadow-sm",
  variants: {
    sticky: {
      true: "sticky top-0 z-50 backdrop-blur-md bg-white/80",
      false: "",
    },
  },
  defaultVariants: {
    sticky: true,
  },
});

type HeaderProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof header> & {
    title?: string;
    onLogout?: () => void;
  };

export function Header({ title = "Dashboard", sticky, className, onLogout }: HeaderProps) {
  return (
    <header className={cn(header({ sticky }), className)}>
      {/* 左側: タイトル */}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* 右側: 操作ボタン */}
      <div className="flex items-center gap-3">
        <Button intent="secondary" size="sm">
          通知
        </Button>
        <Button intent="danger" size="sm" onClick={onLogout}>
          ログアウト
        </Button>
      </div>
    </header>
  );
}