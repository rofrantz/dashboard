import { useMemo, useState } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';

import dashboardConfig from '../data/dashboard.json';
import './dashboard-grid.scss';
import './resize-handle.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);
const rowHeight = 43;
const minCardWidth = 3;
const minCardHeight = 4;

type DashboardLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
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
  const [layouts, setLayouts] = useState<Layouts>(() =>
    Object.fromEntries(
      Object.keys(dashboardConfig.columns).map((breakpoint) => [
        breakpoint,
        dashboardConfig.items.map((item) => ({
          ...item.layout[breakpoint as keyof typeof item.layout],
          i: item.id,
          minW: Math.min(minCardWidth, dashboardConfig.columns[breakpoint as keyof typeof dashboardConfig.columns]),
          minH: minCardHeight,
        })),
      ]),
    ),
  );

  useMemo(() => new Map(dashboardConfig.items.map((item) => [item.id, item])), []);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{dashboardConfig.title}</h1>
          <p className="dashboard-subtitle">{dashboardConfig.subtitle}</p>
        </div>
        <div className="layout-hint">Drag to move · resize from the corners</div>
      </header>

      <ResponsiveGridLayout
        className="dashboard-grid"
        layouts={layouts}
        breakpoints={dashboardConfig.breakpoints}
        cols={dashboardConfig.columns}
        rowHeight={rowHeight}
        margin={dashboardConfig.margin as [number, number]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        draggableHandle=".dashboard-card__handle"
        onLayoutChange={(_current: Layout[], all: Layouts) => setLayouts(all)}
      >
        {dashboardConfig.items.map((item: HomepageDashboardCard) => (
          <section className="dashboard-card" key={item.id}>
            <div className="dashboard-card__handle" aria-label={`Move ${item.title}`}>
              <span className="dashboard-card__grip" aria-hidden="true">⠿</span>
              <span>{item.title}</span>
              <time className="dashboard-card__updated" dateTime={item.lastUpdated}>
                Updated {new Date(item.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
            {item.description && <p className="dashboard-card__description">{item.description}</p>}
            <div className="dashboard-card__body">
              <ul className="dashboard-card__list">
                {item.items.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            </div>
          </section>
        ))}
      </ResponsiveGridLayout>
    </main>
  );
}
