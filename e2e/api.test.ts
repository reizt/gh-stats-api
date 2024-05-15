describe('API', () => {
  const baseUrl = () => new URL('/api/langs', 'http://localhost:6400');
  it('should return 200', async () => {
    const url = baseUrl();
    url.searchParams.set('username', 'reizt');
    url.searchParams.set('theme', 'light');
    url.searchParams.set('output', 'svg');
    url.searchParams.set('limit', '5');
    const response = await fetch(url);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
    expect(response.blob()).resolves.toBeInstanceOf(Blob);
  });
});
