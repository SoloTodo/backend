export type ApiResourceObject = {
    url: string,
    id: number
}

export type Country = ApiResourceObject & {
    name: string,
    iso_code: string,
    currency: string,
    number_format: string,
    flag: string,
}

export type StoreType = ApiResourceObject & {
    name: string
}