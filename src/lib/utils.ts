import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ActionResult } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function fail<T>(error: string, fieldErrors?: Record<string, string>): ActionResult<T> {
  return { success: false, error, fieldErrors }
}
