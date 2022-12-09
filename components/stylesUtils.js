// Converter Hex to RGB or optional rgba when opacity ist given

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16)
    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    } else {
        return `rgba(${r}, ${g}, ${b}, 0)`
    }
}

export default function formatTimestamp(timeToConvert, format) {
    if (!timeToConvert) return ""
    const date = new Date(timeToConvert)
    let converted
    switch (format) {
        case "dd.MM.yyyy":
            converted = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
            break
        case "dd.MMMM.yyyy":
            converted = `${date.getDay()}. ${months[date.getMonth()]} ${date.getFullYear()}`
            break
        case "dd.MM.yyyy HH.mm":
            converted = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
            break
        case "dd.MMMM.yyyy HH:mm":
            converted = `${date.getDay()}. ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
            break
        case "HH.mm":
            converted = `${date.getHours()}:${date.getMinutes()}`
            break
        default:
            converted = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
    }
    return converted
}

function minuteFormat(minute) {
    if (minute < 10) {
        return "0" + minute
    } else {
        return minute
    }
}

export function getDiscountPrice(price, percent) {
    if (percent) {
        return price - (price / 100 * percent)
    }
}