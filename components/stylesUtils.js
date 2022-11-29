// Style configuration for react-select Multi-dropdown

export const selectStyles = {
    control: base => ({
        ...base,
        height: 50,
        borderWidth: 2
    }),
    placeholder: base => ({
        ...base,
        color: "#757570"
    }),
    menuList: base => ({
        ...base,
        border: "solid " + "#757570",
        borderWidth: 1,
        borderRadius: 6,
        background: "#060525",
        maxHeight: 400
    }),
    option: base => ({
        ...base,
        ":hover": {
            background: "#1e90ff"
        },
    }),
    multiValue: base => ({
        ...base,
        background: "#8DF3E8",
        color: "#000000"
    }),
    multiValueRemove: base => ({
        ...base,
        background: "#8DF3E8",
        color: "#000000",
        ":hover": {
            background: "#73d0c6",

        }
    })
}

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