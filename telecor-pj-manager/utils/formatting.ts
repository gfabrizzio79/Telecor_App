
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === null || value === undefined) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
