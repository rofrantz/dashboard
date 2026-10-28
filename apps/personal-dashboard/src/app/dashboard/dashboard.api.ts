import type { DashboardConfig } from './dashboard.types';

const dashboardConfigUrl = new URL('../../data/dashboard.json', import.meta.url).href;

export async function fetchDashboardConfig(signal?: AbortSignal): Promise<DashboardConfig> {
  const response = await fetch(`${dashboardConfigUrl}?runtime=${Date.now()}`, {
    signal,
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Dashboard configuration request failed (${response.status})`);

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) {
    throw new Error('Dashboard configuration endpoint returned HTML instead of JSON');
  }
  return response.json() as Promise<DashboardConfig>;
}
