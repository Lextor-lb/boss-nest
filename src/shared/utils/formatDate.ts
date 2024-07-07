export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options).replace(/,/g, '');
}
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export function getPercentage(salePrice: number, stockPrice: number): number {
  const percentage = ((salePrice - stockPrice) / stockPrice) * 100;

  return Number(percentage.toFixed(0));
}
