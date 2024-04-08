import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeDelta(seconds: number) {
  const years = Math.floor(seconds / (60 * 60 * 24 * 365));
  seconds -= years * 60 * 60 * 24 * 365;

  const months = Math.floor(seconds / (60 * 60 * 24 * 30));
  seconds -= months * 60 * 60 * 24 * 30;

  const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
  seconds -= weeks * 60 * 60 * 24 * 7;

  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds -= days * 60 * 60 * 24;

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const parts = [];

  if (years > 0) {
    parts.push(`${years}y`);
  }
  if (months > 0) {
    parts.push(`${months}mo`);
  }
  if (weeks > 0) {
    parts.push(`${weeks}w`);
  }
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 && parts.length <= 1) {
    parts.push(`${seconds}s`);
  }

  // If no parts found, return 0 minutes
  if (parts.length === 0) {
    return '0m';
  }

  return parts.join(' ');
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }
  await navigator.serviceWorker.register('/sw.js');
}

export async function getReadyServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }
  return navigator.serviceWorker.ready;
}
