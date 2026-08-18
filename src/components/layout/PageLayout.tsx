import { TopNav } from './TopNav'
import { BottomNav } from './BottomNav'
import { RightSidebar } from './RightSidebar'
import { MessageCenter } from './MessageCenter'
import { EncounterOverlay } from './EncounterOverlay'

interface PageLayoutProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
  fullScreen?: boolean
  children: React.ReactNode
}

export function PageLayout({ title, showBack, onBack, rightContent, fullScreen, children }: PageLayoutProps) {
  if (fullScreen) {
    return (
      <>
        {children}
        <RightSidebar />
        <MessageCenter />
        <EncounterOverlay />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav title={title} showBack={showBack} onBack={onBack} rightContent={rightContent} />
      <RightSidebar />
      <main className="pt-[88px] pb-[80px]">
        <div className="px-margin py-md">
          {children}
        </div>
      </main>
      <MessageCenter />
      <EncounterOverlay />
      <BottomNav />
    </div>
  )
}
