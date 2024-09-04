export const calculateAge = (
  establishmentDate: Date,
): { value: number; unit: 'months' | 'years' } => {
  const now = new Date();
  const difference = now.getTime() - establishmentDate.getTime();
  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
  if (years === 0) {
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.4375));
    return { value: months, unit: 'months' };
  }
  return { value: years, unit: 'years' };
};
