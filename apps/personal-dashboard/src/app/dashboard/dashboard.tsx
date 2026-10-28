import {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {type Layout, type Layouts, Responsive} from 'react-grid-layout';

import {fetchDashboardConfig} from './dashboard.api';
import type {DashboardAction, DashboardState} from './dashboard.types';

import './dashboard.scss';

const minCardWidth = 6;
const minCardHeight = 12;

const initialState: DashboardState = {status: 'loading'};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'loaded':
      return {status: 'ready', config: action.config};
    case 'failed':
      return {status: 'error', error: action.error};
    default:
      return state;
  }
}

export function Dashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [layouts, setLayouts] = useState<Layouts>({});
  const [gridWidth, setGridWidth] = useState(0);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardConfig(controller.signal)
      .then((config) => dispatch({type: 'loaded', config}))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        dispatch({
          type: 'failed', error: error instanceof Error ? error.message : 'Unable to load dashboard configuration'
        });
      });
    return () => controller.abort();
  }, []);

  const config = state.status === 'ready' ? state.config : null;
  const configuredLayouts = useMemo<Layouts>(() => config ? Object.fromEntries(Object.keys(config.columns).map((breakpoint) => [breakpoint, config.items.map((item): Layout => {
    const itemLayout = item.layout?.[breakpoint];
    return {
      i: item.id,
      x: itemLayout?.x ?? 0,
      y: itemLayout?.y ?? 0,
      w: itemLayout?.w ?? 1,
      h: itemLayout?.h ?? 1,
      minW: itemLayout?.minW ?? minCardWidth,
      minH: itemLayout?.minH ?? minCardHeight
    };
  }),]),) : {}, [config]);

  useEffect(() => {
    if (config) {
      setLayouts(configuredLayouts);
    }
  }, [config, configuredLayouts]);

  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;
    const updateWidth = () => setGridWidth(container.getBoundingClientRect().width);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, [config]);

  if (state.status === 'loading') return <main className="p-10 text-slate-500">Loading dashboard configuration…</main>;
  if (state.status === 'error') return <main className="p-10 text-red-600" role="alert">{state.error}</main>;
  if (!config) return null;

  return (<main className="min-h-screen bg-slate-50 p-8 text-slate-900">
    <h1 className="text-4xl font-bold">Personal dashboard</h1>
    <p className="mt-3 text-slate-500">A flexible home for the things you check most often.</p>
    <div ref={gridContainerRef} className="mx-auto mt-8 w-full">
      {gridWidth > 0 && (<Responsive
        width={gridWidth}
        className="w-full"
        layouts={layouts}
        breakpoints={config.breakpoints}
        cols={config.columns}
        rowHeight={0.5}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        draggableHandle=".cursor-move"
        onLayoutChange={(_layout, allLayouts) => setLayouts(allLayouts)}
      >
        {config.items.map((item) => (
          <section key={item.id} className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
            {item.title &&
              <div className="flex cursor-move items-center gap-2 font-bold mb-2" aria-label={`Move ${item.title}`}>
                <span className="text-[22px] leading-none text-slate-400" aria-hidden="true">⠿</span>
                <span>{item.title}</span>
                {item.lastUpdated && <time
                  className="ml-auto whitespace-nowrap text-[11px] font-medium tracking-[.02em] text-slate-400"
                  dateTime={item.lastUpdated}>
                  Updated {new Date(item.lastUpdated).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
                </time>}
              </div>}
            {item.description && <p className="my-2 text-sm text-slate-500">{item.description}</p>}
            {item.items && <div
              className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#c5ccda_transparent] scrollbar-thin">
              <ul className="mt-4 grid gap-2">{item.items.map((entry) => <li
                className="rounded-lg bg-slate-100 p-3 text-sm" key={entry}>{entry}</li>)}</ul>
            </div>}
          </section>))}
      </Responsive>)}
    </div>
  </main>);
}

export default Dashboard;
