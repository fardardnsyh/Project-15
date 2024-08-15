export enum PercentageClass {
  High = 'resultsPercentage--High',
  Medium = 'resultsPercentage--Medium',
  Low = 'resultsPercentage--Low',
}

export function GetPercentageClass(percentage: number): PercentageClass {
  if (percentage >= 75) {
    return PercentageClass.High;
  } else if (percentage >= 50) {
    return PercentageClass.Medium;
  } else {
    return PercentageClass.Low;
  }
}
