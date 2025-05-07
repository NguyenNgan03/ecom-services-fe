/**
 * Giải mã JWT token để lấy thông tin payload
 * @param {string} token - JWT token cần giải mã
 * @returns {object|null} - Payload của token hoặc null nếu token không hợp lệ
 */
export const decodeToken = (token) => {
  if (!token) {
    console.error("No token provided to decodeToken");
    return null;
  }

  try {
    // Kiểm tra token có đúng định dạng JWT không (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error(
        "Invalid JWT format, expected 3 parts but got",
        parts.length
      );
      return null;
    }

    // JWT token có cấu trúc: header.payload.signature
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    try {
      // Thử decode base64
      const jsonPayload = atob(base64);

      // Parse JSON payload
      try {
        const payload = JSON.parse(jsonPayload);
        console.log(
          "Token decoded successfully, expires at:",
          new Date(payload.exp * 1000).toLocaleString()
        );
        return payload;
      } catch (jsonError) {
        console.error("Error parsing JSON payload:", jsonError);
        return null;
      }
    } catch (base64Error) {
      console.error("Error decoding base64:", base64Error);

      // Thử cách khác nếu atob() không hoạt động
      try {
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        return JSON.parse(jsonPayload);
      } catch (fallbackError) {
        console.error("Fallback decoding also failed:", fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Kiểm tra token có hết hạn chưa
 * @param {string} token - JWT token cần kiểm tra
 * @returns {boolean} - true nếu token hết hạn, false nếu còn hạn
 */
export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return true;

  // exp là thời gian hết hạn của token (tính bằng giây)
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

/**
 * Lấy thông tin người dùng từ token
 * @param {string} token - JWT token
 * @returns {object|null} - Thông tin người dùng hoặc null nếu token không hợp lệ
 */
export const getUserInfoFromToken = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return null;

  return {
    email: decodedToken.sub, // JWT thường lưu email trong trường sub
    role: decodedToken.role, // Lấy role từ token
    // Các thông tin khác nếu có
  };
};

/**
 * Kiểm tra người dùng có quyền admin không
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu là admin, false nếu không phải
 */
export const isAdmin = (token) => {
  const userInfo = getUserInfoFromToken(token);
  return userInfo?.role === "admin";
};

/**
 * Kiểm tra token sắp hết hạn (còn dưới 5 phút)
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu token sắp hết hạn, false nếu còn thời gian
 */
export const isTokenAlmostExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return true;

  const currentTime = Date.now() / 1000;
  const fiveMinutesInSeconds = 5 * 60;

  // Token sắp hết hạn nếu còn dưới 5 phút
  return decodedToken.exp - currentTime < fiveMinutesInSeconds;
};
