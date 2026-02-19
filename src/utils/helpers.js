import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getStatusColor(status) {
  switch (status) {
    case "Converted":
      return "bg-green-100 text-green-800";
    case "Dropped":
      return "bg-red-100 text-red-800";
    case "Visit Office":
      return "bg-blue-100 text-blue-800";
    case "Not Interested":
      return "bg-red-100 text-red-800";
    case "Interested":
      return "bg-green-100 text-green-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
