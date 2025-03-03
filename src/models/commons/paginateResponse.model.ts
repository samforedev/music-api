export interface PaginateResponse<T> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: T[]
}

export class PaginationDto {
    page: number = 1;
    limit: number = 10;
}

export class FilterRequestDto {
    filter?: Record<string, any>;
}