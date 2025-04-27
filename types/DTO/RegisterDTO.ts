import type { Gender } from "~/types/Gender";

export interface RegisterDTO {
  account: string;
  birth_date: Date;
  gender: Gender;
  password: string;
}
