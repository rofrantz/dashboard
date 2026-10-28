import {fetchDashboardConfig} from './dashboard.api';

const config = {
  breakpoints: {lg: 1200},
  columns: {lg: 12},
  items: [],
};

describe('fetchDashboardConfig', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads JSON configuration without caching it', async () => {
    const json = vi.fn().mockResolvedValue(config);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({'content-type': 'application/json'}),
      json,
    });
    vi.stubGlobal('fetch', fetchMock);
    const signal = new AbortController().signal;

    await expect(fetchDashboardConfig(signal)).resolves.toEqual(config);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('runtime='), {
      signal,
      cache: 'no-store',
    });
    expect(json).toHaveBeenCalledOnce();
  });

  it('reports HTTP failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers({'content-type': 'application/json'}),
    }));

    await expect(fetchDashboardConfig()).rejects.toThrow('Dashboard configuration request failed (503)');
  });

  it('rejects non-JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({'content-type': 'text/html'}),
    }));

    await expect(fetchDashboardConfig()).rejects.toThrow('returned HTML instead of JSON');
  });
});
