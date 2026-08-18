import { useLocation } from 'wouter'
import { NAV_ITEMS, NavItemConfig } from './navConfig'

interface TopNavProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
}

export function TopNav({ title = 'Hanseatic Strategos', showBack, onBack, rightContent }: TopNavProps) {
  const [location, setLocation] = useLocation()

  const navItems: NavItemConfig[] = NAV_ITEMS

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
      <div className="flex items-center gap-md">
        {showBack && (
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center justify-center p-xs hover:bg-surface-variant/30 rounded-xl transition-all duration-200"
            aria-label="Volver"
          >
            <span className="material-symbols-outlined text-tertiary-fixed" aria-hidden="true">arrow_back</span>
          </button>
        )}
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-tertiary-fixed tracking-tight">
          {title}
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-lg" aria-label="Navegación principal">
        {navItems.map((item) => {
          const isActive = location === item.path
          return (
            <a
              key={item.id}
              href={item.path}
              className={`font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1'
                  : 'text-on-surface-variant hover:text-tertiary-fixed'
              }`}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); setLocation(item.path) }}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
      <div className="flex items-center gap-sm">
        {rightContent || (
          <>
            <button 
              onClick={() => setLocation('/messages')}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-on-surface-variant hover:text-tertiary-fixed cursor-pointer bg-transparent border-0" 
              aria-label="Notificaciones"
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <button 
              onClick={() => setLocation('/wiki')}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-on-surface-variant hover:text-tertiary-fixed cursor-pointer bg-transparent border-0" 
              aria-label="Manual Técnico"
            >
              <span className="material-symbols-outlined" aria-hidden="true">help</span>
            </button>
            <button 
              onClick={() => setLocation('/settings')}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-on-surface-variant hover:text-tertiary-fixed cursor-pointer bg-transparent border-0" 
              aria-label="Ajustes"
            >
              <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-tertiary overflow-hidden shadow-lg bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary-fixed" aria-hidden="true">person</span>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export type { TopNavProps }
