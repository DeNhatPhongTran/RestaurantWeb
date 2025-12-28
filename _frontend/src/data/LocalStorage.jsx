
/**
 * Lấy thông tin user từ localStorage
 * @param {string} key - Tên key trong localStorage (mặc định là 'userInfo')
 * @returns {object|null} - Dữ liệu đã parse từ JSON hoặc null nếu không có
 */
export const getUserInfo = (key = 'userInfo') => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing userInfo:', error);
    return null;
  }
};

/**
 * Lưu thông tin user vào localStorage
 * @param {string} key - Tên key để lưu trữ dữ liệu
 * @param {object} value - Dữ liệu cần lưu trữ
 */
export const setUserInfo = (key = 'userInfo', value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving userInfo:', error);
  }
};

/**
 * Xóa thông tin user từ localStorage
 * @param {string} key - Tên key cần xóa (mặc định là 'userInfo')
 */
export const removeUserInfo = (key = 'userInfo') => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing userInfo:', error);
  }
};
