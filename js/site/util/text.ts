export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    // Split the text into words
    const words = text.split(' ');

    // Initialize variables to keep track of the current length and truncated text
    let currentLength = 0;
    let truncatedText = '';

    // Iterate through the words and add them to the truncated text until maxLength is reached
    for (const word of words) {
        if (currentLength + word.length + 1 <= maxLength) {
            // Add the word and a space
            truncatedText += word + ' ';
            currentLength += word.length + 1;
        } else {
            // Stop if adding the next word would exceed maxLength
            break;
        }
    }

    // Add ellipsis if the text was truncated
    if (truncatedText !== text) {
        truncatedText = truncatedText.trim() + '...';
    }

    return truncatedText;
}

export function snakeToCamel(s: string): string {
    return s.replace(/(_\w)/g, m => m[1].toUpperCase());
}

