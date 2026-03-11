import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderProps {
  title?: string
}

export function SiteHeader({ title = "Dashboard" }: SiteHeaderProps) {
  return (
    <header className="flex min-h-14 shrink-0 items-center border-b border-sidebar-border bg-sidebar py-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:py-2">
      <div className="flex w-full items-center gap-2 px-1">
        <SidebarTrigger className="-ml-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        <Separator
          orientation="vertical"
          className="h-4 bg-sidebar-border"
        />
        <h1 className="text-base font-medium text-sidebar-foreground">{title}</h1>
      </div>
    </header>
  )
}
