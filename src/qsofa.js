export function calculateQsofa({ respiratoryRate, systolicBP, gcs }) {
  for (const [name, value] of Object.entries({ respiratoryRate, systolicBP, gcs })) {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${name} 必須是有限數字`);
    }
  }
  if (!Number.isInteger(gcs) || gcs < 3 || gcs > 15) {
    throw new RangeError('gcs 必須是 3 到 15 的整數');
  }

  const criteria = {
    respiratoryRate: respiratoryRate >= 22,
    systolicBP: systolicBP <= 100,
    mentation: gcs < 15,
  };
  const score = Object.values(criteria).filter(Boolean).length;
  return { score, positive: score >= 2, criteria };
}
