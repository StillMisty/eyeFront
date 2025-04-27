import type { Gender } from "../Gender";

export interface MeDTO {
  /**
   * Account
   */
  account: string;
  /**
   * Birth Date
   */
  birth_date: Date;
  /**
   * Gender
   */
  gender: Gender;
  /**
   * Id
   */
  id: number;
}
