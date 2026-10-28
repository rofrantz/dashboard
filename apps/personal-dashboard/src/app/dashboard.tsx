import {useMemo, useState} from 'react';
import {type Layout, type Layouts, Responsive, WidthProvider} from 'react-grid-layout';

import dashboardConfig from '../data/dashboard.json';
import './dashboard.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

const rowHeight = 40;     // height of each row in pixels

const minCardWidth = 6;
const minCardHeight = 2;

type DashboardLayout = {
  x: number; y: number; w: number; h: number;
};

export type HomepageDashboardCard = {
  id: string;
  title: string;
  description?: string;
  lastUpdated: string;
  items: string[];
  layout: Record<string, DashboardLayout>;
};

export function Dashboard() {
  const [layouts, setLayouts] = useState<Layouts>(() => Object.fromEntries(Object.keys(dashboardConfig.columns).map((breakpoint) => [breakpoint, dashboardConfig.items.map((item) => ({
    ...item.layout[breakpoint as keyof typeof item.layout], i: item.id, minW: minCardWidth, minH: minCardHeight
  })),]),),);

  useMemo(() => new Map(dashboardConfig.items.map((item) => [item.id, item])), []);

  return (<main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-900 sm:px-10 sm:py-12 lg:px-[5vw]">
    <header className="mx-auto mb-7 flex max-w-360 flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.12em] text-slate-500">Workspace</p>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">{dashboardConfig.title}</h1>
        <p className="mt-3 text-base text-slate-500">{dashboardConfig.subtitle}</p>
      </div>
      <div className="text-xs text-slate-400">Drag to move · resize from the corners</div>
    </header>

    <ResponsiveGridLayout
      className="dashboard-grid"
      layouts={layouts}
      breakpoints={dashboardConfig.breakpoints}
      cols={dashboardConfig.columns}
      rowHeight={0.5}
      margin={[16, 16]}
      containerPadding={[0, 0]}
      isDraggable
      isResizable
      draggableHandle=".cursor-move"
      onLayoutChange={(_current: Layout[], all: Layouts) => setLayouts(all)}
    >
      {dashboardConfig.items.map((item: HomepageDashboardCard) => (<section
        key={item.id}
        className="flex h-full flex-col overflow-visible rounded-[20px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_24px_rgba(20,34,66,.06),0_2px_5px_rgba(20,34,66,.04)] transition-shadow duration-500 ease-out hover:shadow-[0_18px_30px_rgba(20,34,66,.14),0_7px_10px_rgba(20,34,66,.08)]"
      >
        <div className="flex cursor-move items-center gap-2 font-bold mb-2" aria-label={`Move ${item.title}`}>
          <span className="text-[22px] leading-none text-slate-400" aria-hidden="true">⠿</span>
          <span>{item.title}</span>
          <time className="ml-auto whitespace-nowrap text-[11px] font-medium tracking-[.02em] text-slate-400"
                dateTime={item.lastUpdated}>
            Updated {new Date(item.lastUpdated).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
          </time>
        </div>
        {item.description && <p className="mb-4 text-sm leading-6 text-slate-500">{item.description}</p>}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#c5ccda_transparent] scrollbar-thin">
          <ul className="grid list-none gap-3 mt-2">
            {item.items.map((entry) => <li style={{height: rowHeight}}
                                           className="flex items-center rounded-xl bg-slate-100 px-3 text-sm text-slate-700"
                                           key={entry}>{entry}</li>)}
          </ul>
        </div>
      </section>))}
    </ResponsiveGridLayout>
  </main>);
}
