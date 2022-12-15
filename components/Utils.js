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
            converted = `${getMonthDay(date)}.${date.getMonth()}.${date.getFullYear()}`
            break
        case "dd.MMMM.yyyy":
            converted = `${getMonthDay(date)}. ${months[date.getMonth()]} ${date.getFullYear()}`
            break
        case "dd.MM.yyyy HH.mm":
            converted = `${getMonthDay(date)}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
            break
        case "dd.MMMM.yyyy HH:mm":
            converted = `${getMonthDay(date)}. ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
            break
        case "dd.MM.yyyyTHH:mm":
            converted = `${getMonthDay(date)}. ${months[date.getMonth()]} ${date.getFullYear()}T${date.getHours()}:${minuteFormat(date.getMinutes())}`
            break
        case "HH.mm":
            converted = `${date.getHours()}:${date.getMinutes()}`
            break
        default:
            converted = `${getMonthDay(date)}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${minuteFormat(date.getMinutes())}`
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

function getMonthDay(date) {
    return date.toString().split(" ")[2]
}

export function getDiscountPrice(price, percent) {
    if (percent) {
        return price - (price / 100 * percent)
    }
}

/*
* When is active:
* active true, start = ""*/

export function checkIfProductIsNowDiscount(start, end, active) {
    const now = new Date()
    let startDate, endDate
    if (active === true) {
        if (start !== "" && end !== "") {
            startDate = new Date(start)
            endDate = new Date(end)
            console.log(`${startDate}\n${endDate}`)
            return (startDate <= now && endDate >= now)
        } else if (end === "") {
            startDate = new Date(start)
            return startDate < now
        } else {
            endDate = new Date(end)
            return endDate > now
        }
    } else {
        return false
    }
}

export function checkIfEventIsNowBetweenStartTime(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const now = new Date()
    return startDate <= now && endDate >= now
}

export function checkIfNowIsPendingBeforeStart(start) {
    const startDate = new Date(start)
    const now = new Date()
    return now <= startDate
}

export function checkIfNowHasEndedAnEvent(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const now = new Date()
    return startDate <= now && endDate <= now
}

export function checkIfEndDateIsGreaterThanStartDate(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return endDate > startDate
}

export function getDate(date) {
    return new Date(date).toString()
}