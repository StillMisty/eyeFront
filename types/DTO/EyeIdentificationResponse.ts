import type { EyeIdentificationResult } from "~/types/EyeIdentificationResult";

/**
 * EyeIdentificationResponse，创建眼部识别记录
 */
export interface EyeIdentificationResponse {
  /**
   * Created At
   */
  created_at: Date;
  /**
   * Id
   */
  id: number;
  /**
   * Image Url
   */
  image_url: string;
  /**
   * Results
   */
  results: EyeIdentificationResult[];
}
