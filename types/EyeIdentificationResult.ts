import type { EyeIdentificationDetail } from "~/types/EyeIdentificationDetail";

/**
 * EyeIdentificationResult，眼部识别记录详情的Pydantic模型
 */
export interface EyeIdentificationResult {
  details: EyeIdentificationDetail;
  /**
   * Label
   */
  label: string;
  /**
   * Probability
   */
  probability: number;
}
