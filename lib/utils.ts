import slugify from "slugify";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDateIndonesian(dateString: string | Date): string {
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(d, "dd MMMM yyyy", { locale: id });
  } catch {
    return String(dateString);
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
