/**
 * YouTube URL validation utilities
 */

/**
 * Validates if a given string is a valid YouTube URL
 *
 * Supports the following formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 *
 * @param url - The URL to validate
 * @returns true if the URL is a valid YouTube URL, false otherwise
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/,
    /^https?:\/\/youtu\.be\/[\w-]{11}/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]{11}/,
  ];

  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Extracts the video ID from a YouTube URL
 *
 * @param url - The YouTube URL
 * @returns The video ID or null if not found
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!isValidYouTubeUrl(url)) {
    return null;
  }

  // Match watch?v= pattern
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  // Match youtu.be/ pattern
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return shortMatch[1];
  }

  // Match embed/ pattern
  const embedMatch = url.match(/embed\/([^?]+)/);
  if (embedMatch) {
    return embedMatch[1];
  }

  return null;
}
