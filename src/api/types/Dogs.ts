export interface Dog {
    id: string
    name: string
    breed: string
    age: number
    zip_code: string
    img: string
}

export interface FetchDogsParams {
    breed?: string[] 
    zipCodes?: string[] 
    ageMin?: number
    ageMax?: number
    size?: number | 25
    from?: number | 0
    sort?: string // Format: "field:asc" or "field:desc"
}

export interface FetchDogsResponse {
    resultIds: string[]
    total: number
    next?: string
    prev?: string
}

export interface Match {
    match: string
}