import type {ReactNode} from 'react';
import {render, screen, waitFor} from '@testing-library/react';

import {fetchDashboardConfig} from './dashboard.api';
import {Dashboard} from './dashboard';

vi.mock('./dashboard.api', () => ({
  fetchDashboardConfig: vi.fn(),
}));

vi.mock('react-grid-layout', () => ({
  Responsive: ({children, isDraggable, isResizable, draggableHandle}: {
    children: ReactNode;
    isDraggable?: boolean;
    isResizable?: boolean;
    draggableHandle?: string;
  }) => (
    <div
      data-testid="responsive-grid"
    >
      {`draggable:${String(isDraggable)} resizable:${String(isResizable)} handle:${draggableHandle}`}
      {children}
    </div>
  ),
}));

const dashboardConfig = {
  breakpoints: {lg: 1200},
  columns: {lg: 12},
  rowHeight: 0.5,
  margin: [16, 16] as [number, number],
  items: [{
    id: 'focus',
    type: 'checkbox-list',
    title: 'Today’s focus',
    items: ['Finish the dashboard shell'],
    layout: {lg: {x: 0, y: 0, w: 6, h: 12}},
  }],
};

describe('Dashboard', () => {
  const fetchConfigMock = vi.mocked(fetchDashboardConfig);

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe(target: {getBoundingClientRect: () => {width: number}}) {
        target.getBoundingClientRect = () => ({width: 1200});
      }
      disconnect() {
        return undefined;
      }
    });
    const documentLike = (globalThis as unknown as {
      document: {createElement: (tagName: string) => object};
    }).document;
    const elementPrototype = Object.getPrototypeOf(documentLike.createElement('div')) as {
      getBoundingClientRect: () => unknown;
    };
    vi.spyOn(elementPrototype, 'getBoundingClientRect').mockReturnValue({
      width: 1200,
      height: 600,
      top: 0,
      right: 1200,
      bottom: 600,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads configuration and enables grid dragging and resizing', async () => {
    fetchConfigMock.mockResolvedValue(dashboardConfig);

    render(<Dashboard/>);

    expect(screen.getByText('Loading dashboard configuration…')).toBeTruthy();
    await waitFor(() => expect(screen.getByRole('heading', {name: 'Personal dashboard'})).toBeTruthy());

    const grid = await waitFor(() => screen.getByTestId('responsive-grid'));
    expect((grid as unknown as {textContent: string}).textContent)
      .toContain('draggable:true resizable:true handle:.cursor-move');
    expect(screen.getByText('Today’s focus')).toBeTruthy();
  });

  it('shows a configuration error when loading fails', async () => {
    fetchConfigMock.mockRejectedValue(new Error('Configuration unavailable'));

    render(<Dashboard/>);

    await waitFor(() => expect(screen.getByText('Configuration unavailable')).toBeTruthy());
  });
});
