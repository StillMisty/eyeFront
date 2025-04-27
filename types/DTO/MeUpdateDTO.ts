import type { Gender } from "~/types/Gender";

/**
 * MeUpdateDTO
 */
export interface MeUpdateDTO {
  birth_date: Date;
  gender: Gender;
}
