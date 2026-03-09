interface PageHeaderProps {
  title: string;
  description?: string;
  iconNode?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  iconNode,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {iconNode && <div className="shrink-0">{iconNode}</div>}
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#F4F6F8" }}>
            {title}
          </h1>
          {description && (
            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
