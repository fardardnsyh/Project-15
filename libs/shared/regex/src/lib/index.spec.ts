import { regex } from '.';

describe('Regex Patterns', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(regex.email.test('example@test.com')).toBe(true);
      expect(regex.email.test('user.name@domain.co')).toBe(true);
    });

    it('should invalidate incorrect email addresses', () => {
      expect(regex.email.test('example@test')).toBe(false);
      expect(regex.email.test('example.com')).toBe(false);
    });
  });

  describe('Link Validation', () => {
    it('should validate correct links', () => {
      expect(regex.link.test('http://example.com')).toBe(true);
      expect(regex.link.test('https://www.example.com/path')).toBe(true);
    });

    it('should invalidate incorrect links', () => {
      expect(regex.link.test('www.example.com')).toBe(false);
      expect(regex.link.test('ftp://example.com')).toBe(false);
    });
  });

  describe('Image URL Validation', () => {
    it('should validate correct image URLs', () => {
      expect(regex.imageUrl.test('http://example.com/image.png')).toBe(true);
      expect(regex.imageUrl.test('https://example.com/photo.jpg')).toBe(true);
    });

    it('should invalidate incorrect image URLs', () => {
      expect(regex.imageUrl.test('http://example.com/image.pdf')).toBe(false);
      expect(regex.imageUrl.test('https://example')).toBe(false);
    });
  });

  describe('Color Code Validation', () => {
    it('should validate correct color codes', () => {
      expect(regex.color.test('#fff')).toBe(true);
      expect(regex.color.test('#123456')).toBe(true);
    });

    it('should invalidate incorrect color codes', () => {
      expect(regex.color.test('123')).toBe(false);
      expect(regex.color.test('#1234')).toBe(false);
    });
  });
});
