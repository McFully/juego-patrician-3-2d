export function RightSidebar() {
  return (
    <aside role="complementary" className="fixed right-margin top-[100px] bottom-[100px] w-64 z-30 pointer-events-none hidden md:block" aria-label="Información de la ciudad">
      <div className="glass-panel p-md rounded-xl space-y-md pointer-events-auto shadow-2xl bg-primary-container/60 backdrop-blur-xl border border-on-surface/10 h-full overflow-y-auto custom-scrollbar">
        <h2 className="font-title-md text-title-md text-tertiary-fixed border-b border-tertiary/20 pb-xs">
          Ciudad
        </h2>
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-label-sm">Población</span>
            <span className="text-on-surface font-title-md">2,480</span>
          </div>
        </div>
        
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-label-sm">Arca</span>
            <span className="text-tertiary-fixed font-title-md">12,450 ₣</span>
          </div>
        </div>

        <h2 className="font-title-md text-title-md text-tertiary-fixed border-b border-tertiary/20 pb-xs pt-md">
          Barco
        </h2>
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-label-sm">Carga</span>
            <span className="text-on-surface font-title-md">45/100</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
