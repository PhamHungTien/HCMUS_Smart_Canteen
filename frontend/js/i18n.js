const translations = {
  vi: {
    menu: 'Thực đơn',
    cart: 'Giỏ hàng',
    checkout: 'Thanh toán',
    feedback: 'Góp ý',
    settings: 'Cài đặt',
    welcome: 'Chào mừng đến với',
    canteen_title: 'Canteen HCMUS!',
    branch: '(Cơ sở Nguyễn Văn Cừ)',
    search_placeholder: 'Tìm kiếm món ăn...',
    your_cart: 'Giỏ hàng của bạn',
    empty_cart: 'Chưa có sản phẩm trong giỏ hàng.',
    total: 'Tổng cộng',
    checkout_btn: 'Thanh toán',
    choose_time: 'Chọn thời gian lấy món',
    payment_method: 'Phương thức thanh toán',
    pay_momo: 'Thanh toán qua Momo',
    pay_vietqr: 'Thanh toán qua VietQR (Ngân hàng)',
    customer: 'Người đặt',
    special_request: 'Yêu cầu đặc biệt',
    special_placeholder: 'Ví dụ: Cà phê ít đường, không đá,...',
    pay_and_order: 'Thanh toán và đặt món',
    rate_dish: 'Đánh giá món ăn',
    choose_dish: 'Chọn món để đánh giá',
    comment_placeholder: 'Cảm nhận của bạn (không bắt buộc)',
    submit_rating: 'Gửi đánh giá',
    feedback_contact: 'Góp ý và Liên hệ',
    feedback_placeholder: 'Nội dung góp ý của bạn...',
    email_placeholder: 'Email của bạn (để nhận phản hồi)',
    submit_feedback: 'Gửi góp ý',
    account_settings: 'Cài đặt tài khoản',
    interface_settings: 'Cài đặt giao diện',
    dark_mode: 'Dark Mode',
    language: 'Ngôn ngữ',
    change_password: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    vietnamese: 'Tiếng Việt',
    english: 'Tiếng Anh',
    all: 'Tất cả',
    food: 'Món ăn',
    drink: 'Đồ uống',
    add_cart: 'Đã thêm {name} vào giỏ hàng',
    error_past_time: 'Không thể đặt món vào thời gian trong quá khứ!',
    error_30_days: 'Chỉ được đặt món trong vòng 30 ngày tới!',
    error_working_hours: 'Chỉ đặt món trong khung giờ 6:00 – 18:00!',
    error_empty_cart: 'Giỏ hàng của bạn đang trống!',
    order_created: 'Đơn hàng đã được tạo. Vui lòng kiểm tra thông tin!',
    order_error: 'Có vấn đề khi ghi nhận đơn hàng!',
    rating_choose_item: 'Vui lòng chọn món để đánh giá!',
    rating_choose_star: 'Vui lòng chọn số sao để đánh giá!',
    rating_success: 'Bạn đã đánh giá món "{name}" {rating} sao. Cảm ơn!',
    rating_error: 'Có lỗi khi gửi đánh giá',
    feedback_invalid: 'Vui lòng kiểm tra lại thông tin góp ý.',
    feedback_success: 'Cảm ơn ý kiến đóng góp của bạn! Chúng tôi sẽ phản hồi qua email.',
    feedback_error: 'Không gửi được góp ý!',
    feedback_text_required: 'Vui lòng nhập nội dung góp ý!',
    feedback_email_required: 'Vui lòng nhập email để nhận phản hồi!',
    invalid_email: 'Email không hợp lệ!',
    not_found: 'Không tìm thấy món ăn nào khớp với tiêu chí của bạn.',
    login_title: 'Đăng nhập',
    username_placeholder: 'Tên đăng nhập',
    password_placeholder: 'Mật khẩu',
    role_user: 'Người dùng',
    role_admin: 'Quản trị',
    login_button: 'Đăng nhập',
    create_account: 'Tạo tài khoản',
    forgot_password: 'Quên mật khẩu?'
  },
  en: {
    menu: 'Menu',
    cart: 'Cart',
    checkout: 'Checkout',
    feedback: 'Feedback',
    settings: 'Settings',
    welcome: 'Welcome to',
    canteen_title: 'HCMUS Canteen!',
    branch: '(Nguyen Van Cu Branch)',
    search_placeholder: 'Search for food...',
    your_cart: 'Your Cart',
    empty_cart: 'No items in your cart.',
    total: 'Total',
    checkout_btn: 'Checkout',
    choose_time: 'Choose pickup time',
    payment_method: 'Payment method',
    pay_momo: 'Pay via Momo',
    pay_vietqr: 'Pay via VietQR (Bank)',
    customer: 'Customer',
    special_request: 'Special requests',
    special_placeholder: 'E.g.: Coffee less sugar, no ice,...',
    pay_and_order: 'Pay and order',
    rate_dish: 'Rate dishes',
    choose_dish: 'Choose item to rate',
    comment_placeholder: 'Your comments (optional)',
    submit_rating: 'Submit rating',
    feedback_contact: 'Feedback & Contact',
    feedback_placeholder: 'Your feedback...',
    email_placeholder: 'Your email (for response)',
    submit_feedback: 'Send feedback',
    account_settings: 'Account settings',
    interface_settings: 'Interface settings',
    dark_mode: 'Dark Mode',
    language: 'Language',
    change_password: 'Change password',
    logout: 'Logout',
    vietnamese: 'Vietnamese',
    english: 'English',
    all: 'All',
    food: 'Food',
    drink: 'Drinks',
    add_cart: 'Added {name} to cart',
    error_past_time: 'Cannot order in the past!',
    error_30_days: 'Orders allowed only within 30 days!',
    error_working_hours: 'Orders only accepted from 6:00 to 18:00!',
    error_empty_cart: 'Your cart is empty!',
    order_created: 'Order created. Please check the information!',
    order_error: 'There was a problem creating the order!',
    rating_choose_item: 'Please select a dish to rate!',
    rating_choose_star: 'Please select star rating!',
    rating_success: 'You rated "{name}" {rating} stars. Thank you!',
    rating_error: 'Error sending rating',
    feedback_invalid: 'Please check your feedback information.',
    feedback_success: 'Thank you for your feedback! We will reply via email.',
    feedback_error: 'Could not send feedback!',
    feedback_text_required: 'Please enter feedback text!',
    feedback_email_required: 'Please enter your email to receive a response!',
    invalid_email: 'Invalid email!',
    not_found: 'No dishes match your criteria.',
    login_title: 'Login',
    username_placeholder: 'Username',
    password_placeholder: 'Password',
    role_user: 'User',
    role_admin: 'Admin',
    login_button: 'Login',
    create_account: 'Create account',
    forgot_password: 'Forgot password?'
  }
};

function getLang() {
  return localStorage.getItem('lang') || 'vi';
}

function t(key, vars) {
  const lang = getLang();
  let str = translations[lang][key] || translations.vi[key] || key;
  if (vars) {
    Object.keys(vars).forEach(k => {
      str = str.replace(`{${k}}`, vars[k]);
    });
  }
  return str;
}
window.t = t;

function setLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
}
window.setLang = setLang;

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.placeholder !== undefined && el.tagName !== 'SELECT' && el.tagName !== 'OPTION') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
}
window.applyTranslations = applyTranslations;

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = getLang();
  applyTranslations();
});
