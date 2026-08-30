import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { getLookAhead } from '../services/api.js'

const TABS = ['Look-Ahead', 'Plan Semanal (PPC)', 'Control Diario']

const ZONE_CLASSES = {
  purple: 'bg-zone-purple-bg text-zone-purple-text',
  green: 'bg-zone-green-bg text-zone-green-text',
  blue: 'bg-zone-blue-bg text-zone-blue-text',
  gray: 'bg-zone-gray-bg text-zone-gray-text',
}

export default function LookAhead() {
  const [activeTab, setActiveTab] = useState('Look-Ahead')
  const [data, setData] = useState({ days: [], rows: [] })

  useEffect(() => {
    getLookAhead('PROY0001').then(setData)
  }, [])

  const { days, rows } = data

  return (
    <Layout title="MAR ABIERTO">
      <div className="mb-3 flex gap-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-2.5 text-[13px] font-semibold ${
              activeTab === tab
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-ink-faint'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mb-4 h-px bg-border" />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex h-[38px] flex-1 items-center justify-between rounded-md border border-border-strong bg-surface px-3.5 text-xs font-semibold text-ink-secondary sm:max-w-[280px]">
          Sem 39-42 · Versión Actual
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <button className="h-[34px] flex-1 rounded-md border border-border-strong bg-surface text-[11px] font-semibold text-ink-secondary sm:flex-none sm:px-6">
          Filtros
        </button>
        <button className="h-[34px] flex-1 rounded-md bg-primary text-[11px] font-semibold text-white sm:flex-none sm:px-6">
          Herramientas ▾
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-surface">
        <table className="w-full min-w-[560px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="whitespace-nowrap bg-[#FAFAFA] p-2.5 text-left text-[9px] font-bold tracking-wide text-ink-muted">
                IND
              </th>
              <th className="whitespace-nowrap bg-[#FAFAFA] p-2.5 text-left text-[9px] font-bold tracking-wide text-ink-muted">
                DESCRIPCIÓN
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className={`p-2.5 text-left text-[9px] font-bold ${
                    day.isToday ? 'bg-primary-bg text-primary' : 'bg-[#FAFAFA] text-ink-muted'
                  }`}
                >
                  {day.date}
                  <br />
                  <span className={day.isToday ? 'font-semibold' : 'font-normal text-ink-faint'}>
                    {day.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) =>
              row.type === 'group' ? (
                <tr key={i} className="bg-[#F3F4F6] font-bold text-ink">
                  <td className="p-2.5">{row.ind}</td>
                  <td className="p-2.5" colSpan={days.length + 1}>
                    ≡ {row.description}
                  </td>
                </tr>
              ) : (
                <tr key={i} className="border-b border-[#F1F2F3]">
                  <td className="p-2.5 text-ink-secondary">{row.ind}</td>
                  <td className="p-2.5 text-ink-secondary">{row.description}</td>
                  {row.zones.map((zone, j) => (
                    <td
                      key={j}
                      className={`p-2.5 ${days[j]?.isToday ? 'bg-[#F0F5F4]' : ''}`}
                    >
                      {zone && (
                        <span
                          className={`inline-block min-w-[26px] rounded-md px-2 py-0.5 text-center text-[9px] font-bold ${ZONE_CLASSES[zone.color]}`}
                        >
                          {zone.code}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
