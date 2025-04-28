import type { Gender } from "~/types/Gender";

export interface IdentityEyeSuggestionRequest {
  /**
   * Age
   */
  age: number;
  /**
   * Disease
   */
  disease: string;
  gender: Gender;
}
