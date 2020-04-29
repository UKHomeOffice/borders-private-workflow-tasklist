import browserIsSupported from './browserIsSupported';

describe('browserIsSupported', () => {
  // Node's jsdom is not expected among user agents...
  const versions = 'Chrome-76.0,Edge-17.17134';
  const chrome =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.5.3987.132 Safari/537.36';
  const edge =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362';
  const firefox =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0';
  const ie = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  it('throws error if versions is not a string', () => {
    const errorMessage = `detectBrowser expects a comma-delimited versions string—e.g. '${versions}'`;
    expect(() => browserIsSupported()).toThrowError(new Error(errorMessage));
    expect(() => browserIsSupported({}, edge)).toThrow(new Error(errorMessage));
    expect(() => browserIsSupported('', edge)).toThrow(new Error(errorMessage));
    expect(() => browserIsSupported(versions, edge)).not.toThrowError();
  });

  it('automatically reports supported if user agent is not found in versions at all', () => {
    expect(browserIsSupported(versions, firefox)).toBe(true);
  });

  it('reports not supported if user agent major version < versions', () => {
    expect(browserIsSupported('Chrome-76.0,Edge-179.0,IE-99', ie)).toBe(false);
  });

  it('reports not supported if user agent major version === versions but user agent minor version < versions', () => {
    expect(browserIsSupported('Chrome-80.7,Edge-17.17134', chrome)).toBe(false);
  });

  it('reports supported if user agent major version === versions and user agent minor version > versions', () => {
    expect(browserIsSupported('Chrome-76.0,Edge-17.17135', edge)).toBe(true);
  });

  it('reports supported if user agent major version === versions and user agent minor version === versions', () => {
    expect(browserIsSupported('Chrome-76.0,Edge-17.17134', edge)).toBe(true);
  });

  it('reports supported if user agent major version > versions and user agent minor version === versions', () => {
    expect(browserIsSupported('Chrome-76.5,Edge-17.17134', chrome)).toBe(true);
  });

  it('reports supported if user agent major version > versions and user agent minor version < versions', () => {
    expect(browserIsSupported('Chrome-76.0,Edge-18.17133', edge)).toBe(true);
  });

  it('reports supported if user agent major version > versions and user agent minor version > versions', () => {
    expect(browserIsSupported(versions, chrome)).toBe(true);
  });

  it('reports supported if user agent major version > versions but minor version is undefined', () => {
    expect(browserIsSupported('Chrome-76,Edge-18.17133', chrome)).toBe(true);
  });

  it('reports supported if user agent major version === versions but minor version is undefined', () => {
    expect(browserIsSupported('Chrome-76.0,Edge-18', edge)).toBe(true);
  });

  it('reports not supported if user agent major version < versions but minor version is undefined', () => {
    expect(browserIsSupported('Chrome-100,Edge-18.17133,IE-99', ie)).toBe(
      false,
    );
  });
});
