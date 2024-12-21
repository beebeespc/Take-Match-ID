function formatTimestampToUTC(timestamp) {
    const date = new Date(timestamp);
    return date.toUTCString();
}

function formatTimestampToLocalTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

function formatUTCToTimestamp(utcString) {
    const date = new Date(utcString);
    return date.getTime();
}

function formatLocalTimeToTimestamp(localString) {
    const date = new Date(localString);
    return date.getTime();
}

function formatLocalTimeToEpochTimestamp(localString) {
    const date = new Date(localString);
    return Math.floor(date.getTime() / 1000);
}

function formatUTCToEpochTimestamp(utcString) {
    const date = new Date(utcString);
    return Math.floor(date.getTime() / 1000);
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}
