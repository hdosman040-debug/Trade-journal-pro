import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely, resolving Tailwind CSS class conflicts.
 * Useful for conditional styling based on trading metrics (e.g., green/red dynamics).
 * 
 * @param inputs - Array of class values, objects, or arrays of classes
 * @returns Combined string of unique, resolved tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Helper to safely format currency inputs or numbers.
 * 
 * @param value - Numerical value to format
 * @param currency - Currency symbol or ISO code
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentages for UI presentation.
 * 
 * @param value - Percentage value (e.g., 12.5)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}