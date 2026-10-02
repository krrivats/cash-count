export function formatIndianRupees(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return '₹0';

  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  const str = abs.toString();

  let result: string;
  if (str.length <= 3) {
    result = str;
  } else {
    const lastThree = str.slice(-3);
    const rest = str.slice(0, -3);
    const groups: string[] = [];
    let remaining = rest;
    while (remaining.length > 2) {
      groups.unshift(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) groups.unshift(remaining);
    result = groups.join(',') + ',' + lastThree;
  }

  return (isNegative ? '-₹' : '₹') + result;
}
