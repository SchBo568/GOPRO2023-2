export interface GetToolDto {
    PK_tool_id?: number,
    name?: string,
    description?: string,
    status?: string,
    rental_rate?: number,
    condition?: string,
    code?: string,
    user?: any,
    kiosk?: any,
    category?: any,
    pictures?: any,
    dateRanges?: any,
    rentings?: any
  }