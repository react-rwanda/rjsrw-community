import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

// Server component. Pass `actions` for right-aligned buttons (e.g. "New event").
export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 pb-6 mb-8 border-b border-neutral-200 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-500 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
