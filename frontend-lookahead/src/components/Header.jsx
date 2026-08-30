import ProfileMenu from './ProfileMenu.jsx'

export default function Header({ title, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-5 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          aria-label="Abrir menú"
          className="flex flex-col gap-1.5 rounded-sm p-1.5 hover:bg-canvas lg:hidden"
        >
          <span className="h-[2.5px] w-5 rounded-full bg-ink-secondary" />
          <span className="h-[2.5px] w-5 rounded-full bg-ink-secondary" />
          <span className="h-[2.5px] w-5 rounded-full bg-ink-secondary" />
        </button>
        <span className="text-base font-bold text-ink">{title}</span>
      </div>
      <div className="lg:hidden">
        <ProfileMenu>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-primary-bg text-xs font-bold text-primary">
            CS
          </span>
        </ProfileMenu>
      </div>
    </header>
  )
}
