/**
 * RatingResponse
 */
export interface CommentResponse {
  /**
   * Comment
   */
  comment?: string;
  /**
   * Created At
   */
  created_at: Date;
  /**
   * Id
   */
  id: number;
  /**
   * Rating
   */
  rating: number;
  /**
   * User Id
   */
  user_id: number;
}
