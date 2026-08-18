import { useLocation } from 'wouter'
import { MOBILE_NAV_ITEMS } from './navConfig'

interface BottomNavProps {
  items?: typeof MOBILE_NAV_ITEMS
}

export function BottomNav({ items = MOBILE_NAV_ITEMS }: BottomNavProps) {
  const [location, setLocation] = useLocation()

  return (
    <footer role="navigation" className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin py-sm bg-primary-container/60 backdrop-blur-xl border-t border-on-surface/10 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] rounded-t-xl md:hidden" aria-label="Navegación inferior">
      {items.map((item) => {
        const isActive = location === item.path || location.startsWith(item.path + '/')
        return (
          <button
            key={item.id}
            onClick={() => setLocation(item.path)}
            className={`flex flex-col items-center justify-center px-md py-xs rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-tertiary-fixed text-on-tertiary-fixed scale-102'
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </button>
        )
      })}
    </footer>
  )
}
