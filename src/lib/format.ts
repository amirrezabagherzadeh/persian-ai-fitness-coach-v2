const faNumber = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const faDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", day: "numeric", month: "long" });

export function nf(value: number): string {
  return faNumber.format(value);
}

export function percent(value: number): string {
  return `${faNumber.format(Math.round(value))}٪`;
}

export function todayFa(): string {
  return faDate.format(new Date());
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
