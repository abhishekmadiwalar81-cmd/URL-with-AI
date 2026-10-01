/**
 * Time and Date utilities for Asia/Kolkata (IST, UTC+05:30)
 */

export function getCurrentTimeIST(): Date {
  // Convert current UTC time to Asia/Kolkata offset (+05:30 = 330 minutes)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

export function formatISTDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function isStoreOpenNow(): { isOpen: boolean; nextStatus: string } {
  const istDate = getCurrentTimeIST();
  const dayOfWeek = istDate.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const currentTotalMinutes = hours * 60 + minutes;

  if (dayOfWeek === 0) {
    // Sunday: 10:00 AM (600) to 02:00 PM (840)
    const openMin = 10 * 60;
    const closeMin = 14 * 60;
    if (currentTotalMinutes >= openMin && currentTotalMinutes < closeMin) {
      return { isOpen: true, nextStatus: 'Open today until 02:00 PM IST' };
    }
    return { isOpen: false, nextStatus: 'Closed now · Opens Monday at 09:30 AM IST' };
  } else {
    // Monday - Saturday: 09:30 AM (570) to 08:00 PM (1200)
    const openMin = 9 * 60 + 30;
    const closeMin = 20 * 60;
    if (currentTotalMinutes >= openMin && currentTotalMinutes < closeMin) {
      return { isOpen: true, nextStatus: 'Open today until 08:00 PM IST' };
    } else if (currentTotalMinutes < openMin) {
      return { isOpen: false, nextStatus: 'Closed now · Opens today at 09:30 AM IST' };
    } else {
      return { isOpen: false, nextStatus: 'Closed for the day · Opens tomorrow at 09:30 AM IST' };
    }
  }
}

export function getAvailableDateOptions(maxDays = 21): { dateStr: string; label: string; isSunday: boolean }[] {
  const options = [];
  const today = getCurrentTimeIST();

  for (let i = 1; i <= maxDays; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isSunday = nextDate.getDay() === 0;
    const label = nextDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    options.push({ dateStr, label, isSunday });
  }

  return options;
}
