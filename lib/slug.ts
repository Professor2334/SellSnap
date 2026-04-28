import { randomBytes } from 'crypto';

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

export function generateUniqueSlug(name: string) {
  const base = slugify(name);
  const suffix = randomBytes(4).toString('hex');
  return `${base}-${suffix}`;
}
