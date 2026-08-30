import { useState, useEffect } from 'react'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout({ title, children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSidebarOpen])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="min-h-screen lg:pl-[280px]">
      <Header title={title} onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="mx-auto max-w-[1100px] p-5 lg:p-10">{children}</div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
