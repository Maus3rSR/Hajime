export interface BreadcrumbItem {
    href?: string
    to?: string // vue-router compliant
    text: Required<string>
}

export type BreadcrumbItemList = Array<BreadcrumbItem>
