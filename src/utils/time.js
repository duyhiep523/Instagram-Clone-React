
export function formatTime(createdAt) {
  if (!createdAt) return '';
  const postTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - postTime;
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  if (diff < MINUTE) return 'Vừa xong';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} phút trước`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} giờ trước`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)} ngày trước`;
  if (diff < MONTH) return `${Math.floor(diff / WEEK)} tuần trước`;
  if (diff < YEAR) return `${Math.floor(diff / MONTH)} tháng trước`;
  return `${Math.floor(diff / YEAR)} năm trước`;
}
