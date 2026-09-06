/**
 * Shared domain models and constants.
 *
 * These mirror the Appwrite schema created by scripts/setup-appwrite.js.
 * Keep them in sync when the schema changes.
 */

/** Allowed values for the project `type` attribute. */
export const PROJECT_TYPES = ['donor', 'probono'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface AppUser {
  email: string;
}

export interface Project {
  $id: string;
  title: string;
  slug: string;
  desc?: string;
  /** Rich-text HTML or plain text with newlines. */
  details?: string;
  /** Legacy rows may hold 'commercial' — treat anything non-'donor' as probono in UI. */
  type?: ProjectType | string;
  image?: string;
  gallery?: string[];
  date?: string;
  createdAt?: string;
}

export interface NewsArticle {
  $id: string;
  title: string;
  desc?: string;
  date?: string;
  image?: string | null;
  createdAt?: string;
}

export interface Publication {
  $id: string;
  title: string;
  category?: string;
  desc?: string;
  link?: string;
  createdAt?: string;
}

export interface TeamMember {
  $id: string;
  name?: string;
  role?: string;
  image?: string | null;
  createdAt?: string;
}
