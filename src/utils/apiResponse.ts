/**
 * Generates a standardized API response object.
 *
 * @param {number} statusCode - HTTP status code or custom response code.
 * @param {string} message - Message describing the response.
 * @param {any} data - Optional array containing response data.
 * @returns {{
 *   statusCode: number,
 *   message: string,
 *   success: true,
 *   data?: any
 * }} Standardized API response object.
 */
export const apiResponse = (
  statusCode: number,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
): {
  statusCode: number;
  message: string;
  success: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
} => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
