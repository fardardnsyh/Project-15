import { StripHtmlPipe } from './strip-html.pipe';

describe('StripHtmlPipe', () => {
  let pipe: StripHtmlPipe;

  beforeEach(() => {
    pipe = new StripHtmlPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should strip HTML tags from string', () => {
    const htmlString: string = '<p>Hello <strong>World</strong>!</p>';
    const expectedOutput: string = 'Hello World!';
    expect(pipe.transform(htmlString)).toBe(expectedOutput);
  });

  it('should return empty string if input is null', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
