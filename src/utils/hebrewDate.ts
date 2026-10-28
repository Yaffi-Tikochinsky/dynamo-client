 import { HDate } from "@hebcal/hdate";

export function toHebrewDate(value: Date | string): string {
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    date = new Date(year, month - 1, day, 12);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error("תאריך לא תקין");
    }
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("תאריך לא תקין");
  }

  return new HDate(date).renderGematriya(true).replace(" ", " ב");
}