import { GetPercentageClass, PercentageClass } from '.';

describe('GetPercentageClass', () => {
  it('should return High for percentages 75 and above', () => {
    expect(GetPercentageClass(75)).toBe(PercentageClass.High);
    expect(GetPercentageClass(100)).toBe(PercentageClass.High);
    expect(GetPercentageClass(85)).toBe(PercentageClass.High);
  });

  it('should return Medium for percentages between 50 and 74', () => {
    expect(GetPercentageClass(50)).toBe(PercentageClass.Medium);
    expect(GetPercentageClass(74)).toBe(PercentageClass.Medium);
    expect(GetPercentageClass(60)).toBe(PercentageClass.Medium);
  });

  it('should return Low for percentages below 50', () => {
    expect(GetPercentageClass(49)).toBe(PercentageClass.Low);
    expect(GetPercentageClass(25)).toBe(PercentageClass.Low);
    expect(GetPercentageClass(0)).toBe(PercentageClass.Low);
  });
});
