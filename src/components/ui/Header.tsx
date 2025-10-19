import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

const header = tv({
  base: "w-full bg-white border-b border-gray-200 px-6 py-4",
});

type HeaderProps = {
  title?: string;
  action?: React.ReactNode;
};

export function Header({ title, action }: HeaderProps) {
  return (
    <header className={cn(header())}>
      <div className="flex items-center justify-between">
        {/* 左側: ページタイトル */}
        <div className="flex flex-col leading-tight">
          <h1 className="text-sm text-blue-600 font-semibold tracking-wide">Easy Go Monitor</h1>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        {/* 右側: アクションボタン */}
        {action && <div className="flex items-center gap-3 ml-6">{action}</div>}
      </div>
    </header>
  );
}
