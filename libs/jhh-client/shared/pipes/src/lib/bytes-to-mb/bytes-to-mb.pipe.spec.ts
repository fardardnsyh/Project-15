import { BytesToMbPipe } from './bytes-to-mb.pipe';

describe('BytesToMbPipe', () => {
  let pipe: BytesToMbPipe;

  beforeEach(() => {
    pipe = new BytesToMbPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert bytes to megabytes', () => {
    const bytes: number = 1048576; // 1 MB in bytes
    const expectedOutput: string = '1.00 MB';
    expect(pipe.transform(bytes)).toBe(expectedOutput);
  });

  it('should handle zero bytes', () => {
    expect(pipe.transform(0)).toBe('0.00 MB');
  });

  it('should format megabytes with two decimal places', () => {
    const bytes: number = 1572864; // 1.5 MB in bytes
    const expectedOutput: string = '1.50 MB';
    expect(pipe.transform(bytes)).toBe(expectedOutput);
  });
});
