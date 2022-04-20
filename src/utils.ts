const resources = ["categories", "countries", "store_types", "currencies", "stores"];
export const resources_query = resources.reduce((acc, r) => {
    return (acc = `${acc}&names=${r}`);
}, "");