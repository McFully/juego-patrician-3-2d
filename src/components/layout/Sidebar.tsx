import { NavItemConfig, NAV_ITEMS } from './navConfig'
import { useLocation } from 'wouter'

interface SidebarProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export function Sidebar({ title, subtitle, children }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="glass-panel p-md rounded-xl space-y-md">
        {title && (
          <div className="border-b border-tertiary/20 pb-xs">
            <h2 className="font-title-md text-title-md text-tertiary-fixed">{title}</h2>
            {subtitle && <p className="text-xs text-on-surface-variant mt-xs">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </aside>
  )
}

interface SidebarNavProps {
  items?: (NavItemConfig & { badge?: string | number })[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const [location, setLocation] = useLocation()

  const navItems = items || NAV_ITEMS

  return (
    <nav className="space-y-xs">
      {navItems.map((item) => {
        const isActive = location === item.path
        return (
          <a
            key={item.id}
            href={item.path}
            onClick={(e) => { e.preventDefault(); setLocation(item.path) }}
            className={`flex items-center gap-sm px-sm py-sm rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-tertiary/20 text-tertiary-fixed font-bold border border-tertiary/30'
                : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-tertiary'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            <span className="flex-1 font-label-sm">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary text-xs rounded-full">{item.badge}</span>
            )}
          </a>
        )
      })}
    </nav>
  )
}
