import { getCookie, setCookie, deleteCookie } from './cookie';

describe('cookieUtils', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  describe('setCookie', () => {
    it('should set a cookie', () => {
      setCookie('test', '123');
      expect(document.cookie).toContain('test=123');
    });

    it('should encode cookie value', () => {
      setCookie('test', 'value with spaces');
      expect(document.cookie).toContain('test=value%20with%20spaces');
    });
  });

  describe('getCookie', () => {
    it('should return the correct cookie value', () => {
      document.cookie = 'sessionId=abc';
      const result = getCookie('sessionId');
      expect(result).toBe('abc');
    });

    it('should return undefined if cookie does not exist', () => {
      const result = getCookie('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteCookie', () => {
    it('should delete a cookie', () => {
      setCookie('remove', 'wow');
      expect(getCookie('remove')).toBe('wow');
      deleteCookie('remove');
      expect(getCookie('remove')).toBeUndefined();
    });
  });
});
