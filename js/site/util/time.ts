export function unixToHumanReadable(unixTimestamp: bigint): string {
    const date = new Date(Number(unixTimestamp) * 1000);
    return date.toLocaleString();
}
