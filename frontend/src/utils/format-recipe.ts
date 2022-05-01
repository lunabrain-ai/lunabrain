export function getSourceHostname(source: string) {
  try {
    return new URL(source).hostname;
  } catch (e) {
    return source;
  }
}
