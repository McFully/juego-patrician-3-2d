import { useLocation } from 'wouter'

export function PoliticalExileState() {
  const [, setLocation] = useLocation()

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-red-950/40 to-slate-950 flex flex-col items-center justify-center select-none p-8">

      {/* ── SEAL ── */}
      <div className="w-24 h-24 rounded-full border-4 border-red-500/50 flex items-center justify-center bg-red-950/50 mb-8 animate-pulse">
        <span className="material-symbols-outlined text-red-400 text-5xl">gavel</span>
      </div>

      {/* ── TITLE ── */}
      <h1 className="text-4xl font-black text-red-400 tracking-[0.2em] uppercase mb-2">
        EXILIADO DE LA HANSA
      </h1>
      <p className="text-red-300/60 text-sm tracking-widest uppercase mb-12">
        Decreto del Consejo Supremo de la Liga · 1401 d.C.
      </p>

      {/* ── STATUS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
        {[
          {
            label: 'REPUTACIÓN',
            value: 'PARIA',
            sub: 'Los mercaderes te escupen. Las puertas de la Liga están cerradas.',
            icon: 'block',
            color: 'border-red-500/40 bg-red-950/30 text-red-400',
          },
          {
            label: 'ASIENTO EN EL CONCEJO',
            value: 'REVOCADO',
            sub: 'Tu voz ya no importa en las cámaras de la Liga Hanseática.',
            icon: 'gavel',
            color: 'border-orange-500/40 bg-orange-950/30 text-orange-400',
          },
          {
            label: 'PATRIMONIO FINAL',
            value: '0 DUC',
            sub: 'Tus activos han sido embargados. Comienzas de cero.',
            icon: 'money_off',
            color: 'border-amber-500/40 bg-amber-950/30 text-amber-400',
          },
        ].map(s => (
          <div key={s.label} className={`glass-panel rounded-xl p-5 text-center border ${s.color}`}>
            <span className={`material-symbols-outlined text-3xl mb-2 block ${s.color.split(' ').pop()}`}>{s.icon}</span>
            <div className="text-white/30 text-xs tracking-widest uppercase mb-1">{s.label}</div>
            <div className={`text-2xl font-black mb-2 ${s.color.split(' ').pop()}`}>{s.value}</div>
            <p className="text-white/30 text-xs leading-relaxed">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── NARRATIVE ── */}
      <div className="max-w-2xl text-center mb-10">
        <p className="text-white/40 text-sm leading-relaxed italic">
          "Has sido excomunicado de la Liga Hanseática. Tus rutas, tus almacenes y tus alianzas
          han desaparecido de la noche a la mañana. El Mar Báltico se extiende ante ti —
          vacío de promesas, lleno de posibilidades para quien tenga el valor de empezar de nuevo."
        </p>
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setLocation('/character-creation')}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-base transition-all shadow-lg shadow-amber-500/30"
        >
          <span className="material-symbols-outlined">restart_alt</span>
          REESCRIBIR TU LEGADO
        </button>
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 font-semibold text-base transition-all"
        >
          <span className="material-symbols-outlined">beach_access</span>
          Retirarse a las Costas
        </button>
      </div>

      {/* ── BOTTOM LABEL ── */}
      <div className="mt-8 text-white/20 text-xs tracking-widest uppercase">
        Estado: EXCOMULGADO · El Mar Báltico te espera
      </div>
    </main>
  )
}
