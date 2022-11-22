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