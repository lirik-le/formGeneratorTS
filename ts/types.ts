export type Data = {
    title: string,
    description: string,
    fields: Fields[],
    buttons: string[]
}

type Fields = {
    label: string,
    attrs: Attrs
}

export type Attrs = {
    name: string,
    type: string,
    variants: Variant[]
    [key: string]: string | Variant[];
}

export type Variant = {
    value: string,
    label: string
}