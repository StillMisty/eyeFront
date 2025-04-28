import type { Order } from "../Order";

export interface PageRequest {
  /**
   * Limit
   */
  limit: number;
  /**
   * Skip
   */
  skip: number;
  sort?: string;
  order?: Order;
}
