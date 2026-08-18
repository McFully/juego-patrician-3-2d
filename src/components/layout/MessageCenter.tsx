import { useState, useEffect } from 'react'
import { useGame } from '../../engine/GameProvider'
import { Card, Button } from '../ui'

interface Message {
  id: string
  type: 'plague' | 'fire' | 'siege' | 'famine' | 'info'
  title: string
  content: string
  cityName?: string
  date: string
}

export function MessageCenter() {
  const { engine } = useGame()
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleGameEvent = (event: any) => {
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: event.type,
        title: event.type.toUpperCase(),
        content: `Disaster has struck ${event.cityName}! A ${event.type} is ravaging the city.`,
        cityName: event.cityName,
        date: new Date().toLocaleDateString(),
      }
      setMessages((prev) => [newMessage, ...prev])
      // Auto-open on disaster? Maybe just show a badge
    }

    engine.on('game_event', handleGameEvent)
    return () => engine.off('game_event', handleGameEvent)
  }, [engine])

  if (messages.length === 0) return null

  return (
    <div className="fixed bottom-24 right-8 z-50">
      <Button 
        variant="primary" 
        size="lg" 
        className="rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">mail</span>
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {messages.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-h-[400px] overflow-y-auto space-y-sm animate-in slide-in-from-bottom-4 duration-300" role="region" aria-label="Centro de mensajes">
          <Card variant="modal" padding="md" className="shadow-2xl border-tertiary/20">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-title-md text-title-md text-tertiary-fixed">Mensajes</h3>
              <Button variant="ghost" size="sm" onClick={() => setMessages([])}>Borrar todo</Button>
            </div>
            <div className="space-y-sm">
              {messages.map((msg) => (
                <div key={msg.id} className="p-sm glass-base rounded-lg border border-on-surface/10 hover:border-tertiary/30 transition-colors">
                  <div className="flex items-center gap-sm mb-xs">
                    <span className={`material-symbols-outlined text-xl ${
                      msg.type === 'info' ? 'text-primary' : 'text-error'
                    }`}>
                      {msg.type === 'plague' ? 'medical_services' : 
                       msg.type === 'fire' ? 'local_fire_department' : 
                       msg.type === 'siege' ? 'forts' : 
                       msg.type === 'famine' ? 'famine' : 'info'}
                    </span>
                    <h4 className="font-label-sm text-label-sm text-on-surface uppercase">{msg.title}</h4>
                    <span className="text-[10px] text-on-surface-variant ml-auto">{msg.date}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{msg.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
