import type { Gender } from "~/types/DTO/Gender";

export interface RegisterDTO {
  account: string;
  birth_date: Date;
  gender: Gender;
  password: string;
}
