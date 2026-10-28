export type DashboardConfig = {
  breakpoints: Record<string, number>;
  columns: Record<string, number>;
  rowHeight: number;
  margin: [number, number];
  items: {
    id: string;
    type: string;
    title?: string;
    description?: string;
    lastUpdated?: string;
    items?: string[];
    layout?: Record<string, { x: number; y: number; w: number; h: number, minW?: number; minH?: number }>;
  }[];
  [key: string]: unknown;
};

export type DashboardState =
  | { status: 'loading'; config?: undefined; error?: undefined }
  | { status: 'ready'; config: DashboardConfig; error?: undefined }
  | { status: 'error'; config?: undefined; error: string };

export type DashboardAction =
  | { type: 'loaded'; config: DashboardConfig }
  | { type: 'failed'; error: string };
