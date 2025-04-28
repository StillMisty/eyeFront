import type { Gender } from "../Gender";

/**
 * EyeIdentificationSuggestion，眼部疾病建议的Pydantic模型
 */
export interface EyeIdentificationSuggestionResponse {
  /**
   * Age
   */
  age: number;
  /**
   * Created At
   */
  created_at: Date;
  /**
   * Disease
   */
  disease: string;
  gender: Gender;
  /**
   * Id
   */
  id: number;
  /**
   * Suggestion
   */
  suggestion: string;
}
