import { GetCategories } from "./GetCategories";
import { GetKiosks } from "./GetKiosks";

export interface GetToolDto {
    PK_tool_id?: number,
    name?: string,
    description?: string,
    status?: string,
    rental_rate?: number,
    condition?: string,
    code?: string,
    user?: any,
    kiosk?: GetKiosks,
    category?: GetCategories,
    pictures?: any,
    dateRanges?: any,
    rentings?: any
  }