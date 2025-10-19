import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

const overlay = tv({
  base: "absolute inset-0 bg-gray-800/50",
});

const content = tv({
  base: "relative bg-white rounded-lg p-6 w-full max-w-md",
});

type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div className={cn(overlay())} aria-hidden="true" />
      {/* モーダル本体 */}
      <div className={cn(content())} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
