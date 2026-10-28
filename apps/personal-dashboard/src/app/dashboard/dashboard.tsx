import {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {type Layout, type Layouts, Responsive} from 'react-grid-layout';

import {DashboardItem} from '../dashboard-item/dashboard-item';

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
          type: 'failed',
          error: error instanceof Error ? error.message : 'Unable to load dashboard configuration'
        });
      });
    return () => controller.abort();
  }, []);

  const config = state.status === 'ready' ? state.config : null;
  const configuredLayouts = useMemo<Layouts>(() => config ? Object.fromEntries(
    Object.keys(config.columns).map((breakpoint) => [breakpoint, config.items.map((item): Layout => {
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
        draggableHandle=".dashboard-card__title-handle"
        onLayoutChange={(_layout, allLayouts) => setLayouts(allLayouts)}
      >
        {config.items.map((item) => <DashboardItem key={item.id} item={item}/>)}
      </Responsive>)}
    </div>
  </main>);
}

export default Dashboard;
