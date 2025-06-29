const { useState, useEffect, useRef } = React;

const defaultMenu = [
  { id: 1, category: 'Món ăn', name: 'Cơm phần thịt kho', price: 25000, originalPrice: 30000, image: 'menu/com_thit_kho.jpg', rating: 4, model: '' },
  { id: 2, category: 'Món ăn', name: 'Bánh mì ốp la', price: 20000, originalPrice: 25000, image: 'menu/banh_mi_op_la.jpg', rating: 3, model: '' },
  { id: 3, category: 'Món ăn', name: 'Salad healthy', price: 30000, originalPrice: 35000, image: 'menu/salad_healthy.jpg', rating: 5, model: '' },
  { id: 4, category: 'Món ăn', name: 'Cơm tấm sườn', price: 28000, originalPrice: 32000, image: 'menu/com_tam_suon.jpg', rating: 4, model: '' },
  { id: 5, category: 'Món ăn', name: 'Phở bò', price: 30000, originalPrice: 38000, image: 'menu/pho_bo.jpg', rating: 5, model: '' },
  { id: 6, category: 'Món ăn', name: 'Bún chả', price: 35000, originalPrice: 38000, image: 'menu/bun_cha.jpg', rating: 4, model: '' },
  { id: 10, category: 'Đồ uống', name: 'Trà sữa', price: 20000, originalPrice: 23000, image: 'menu/tra_sua.jpg', rating: 4, model: '' },
  { id: 11, category: 'Đồ uống', name: 'Cà phê sữa đá', price: 15000, originalPrice: 18000, image: 'menu/ca_phe_sua_da.jpg', rating: 3, model: '' },
  { id: 12, category: 'Đồ uống', name: 'Nước ép detox', price: 15000, originalPrice: 18000, image: 'menu/nuoc_ep_detox.jpg', rating: 5, model: '' },
  { id: 13, category: 'Đồ uống', name: 'Nước cam vắt', price: 18000, originalPrice: 22000, image: 'menu/nuoc_cam_vat.jpg', rating: 4, model: '' },
  { id: 14, category: 'Đồ uống', name: 'Nước mía', price: 12000, originalPrice: 15000, image: 'menu/nuoc_mia.jpg', rating: 3, model: '' },
  { id: 15, category: 'Đồ uống', name: 'Sữa chua nếp cẩm', price: 25000, originalPrice: 28000, image: 'menu/sua_chua_nep_cam.jpg', rating: 5, model: '' }
];

// Paste the App component code from existing file
function App() {
const [menuItems, setMenuItems] = useState(defaultMenu);
const [cart, setCart] = useState([]);
const [addingId, setAddingId] = useState(null);
const [pickup, setPickup] = useState('');
const [special, setSpecial] = useState('');
const [loading, setLoading] = useState(false);
const [selectedMenuItem, setSelectedMenuItem] = useState('');
const [rating, setRating] = useState(0);
const [reviewComment, setReviewComment] = useState('');
const [feedbackText, setFeedbackText] = useState('');
const [feedbackEmail, setFeedbackEmail] = useState('');

const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
const [language, setLanguage] = useState(localStorage.getItem('lang') || 'vi');
const [fullName, setFullName] = useState(localStorage.getItem('fullName') || '');
const [staffId, setStaffId] = useState(localStorage.getItem('staffId') || '');

const [feedbackTextError, setFeedbackTextError] = useState('');
const [feedbackEmailError, setFeedbackEmailError] = useState('');

const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState(t('all'));

const [showConfirmationModal, setShowConfirmationModal] = useState(false);
const [orderDetails, setOrderDetails] = useState(null);
const [paymentMethod, setPaymentMethod] = useState('cod');
const [arItem, setArItem] = useState(null);

const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('staffId');
    localStorage.removeItem('role');
    window.location.href = '/login';
};

useEffect(() => {
    if (!localStorage.getItem('auth')) {
        window.location.href = '/login';
    }
}, []);

useEffect(() => {
    fetch('/menu')
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(() => {});
}, []);

// Refs for scrolling to sections
const menuSectionRef = useRef(null);
const cartSectionRef = useRef(null);
const infoSectionRef = useRef(null); // Để cuộn đến phần thông tin chung
const feedbackSectionRef = useRef(null); // Để cuộn đến phần đánh giá/góp ý

// State for active tab
const [activeTab, setActiveTab] = useState('menu');
// Thêm state điều hướng trang
const [currentPage, setCurrentPage] = useState('menu');

// Function to handle tab clicks and scroll
const handleTabClick = (tabName, ref) => {
    setActiveTab(tabName);
    setCurrentPage(tabName);
    // Không scroll khi chuyển trang
};

// Floating cart icon click cũng chuyển trang
const handleFloatingCartClick = () => {
    setActiveTab('cart');
    setCurrentPage('cart');
};

// Nút "Thanh toán" trên trang giỏ hàng
const handleGoToCheckout = () => {
    setActiveTab('checkout');
    setCurrentPage('checkout');
};

// Set initial pickup time to 15 minutes from now
useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    setPickup(now.toISOString().slice(0,16));
}, []);

// Effect để thêm/bỏ class modal-open cho body
useEffect(() => {
    if (showConfirmationModal) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
    return () => {
        document.body.classList.remove('modal-open');
    };
}, [showConfirmationModal]);

useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
}, [darkMode]);

useEffect(() => {
    setLang(language);
    applyTranslations();
}, [language]);

useEffect(() => {
    setSelectedCategory(t('all'));
}, [language]);


const addItemToCart = (item) => {
    if (addingId === item.id) return;
    setAddingId(item.id);
    setTimeout(() => {
        setCart(prev => {
            const existingItem = prev.find(x => x.id === item.id);
            if (existingItem) {
                return prev.map(x => x.id === item.id ? { ...x, qty: Math.min(10, x.qty + 1) } : x);
            }
            return [...prev, { ...item, qty: 1 }];
        });
        showToast(t('add_cart', {name: item.name}));
        setAddingId(null);
        // XÓA DÒNG NÀY ĐỂ NGĂN TỰ ĐỘNG CUỘN ĐẾN GIỎ HÀNG:
        // handleTabClick('cart', cartSectionRef); 
    }, 300);
};

const removeItemFromCart = (index) => setCart(prev => prev.filter((_, idx) => idx !== index));

const updateItemQuantity = (index, delta) => setCart(prev =>
    prev.map((x, idx) => idx === index ? { ...x, qty: Math.max(1, Math.min(10, x.qty + delta)) } : x)
);

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const handleImageClick = (item) => {
    if (isMobile && item.model) {
        setArItem(item);
    } else if (!isMobile) {
        showToast('Tính năng AR chỉ khả dụng trên thiết bị di động');
    } else if (!item.model) {
        showToast('Món ăn này chưa có mô hình 3D');
    }
};
const calculateCartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateOrderId = () => 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

const handleCheckout = () => {
    let isValid = true;
    const pickupDate = new Date(pickup);
    const now = new Date();
    const maxAllowedDate = new Date(now.getTime() + 30 * 24 * 60 * 60000);

    if (pickupDate < now) { showToast(t('error_past_time')); isValid = false; }
    if (pickupDate > maxAllowedDate) { showToast(t('error_30_days')); isValid = false; }
    const pickupHour = pickupDate.getHours();
    if (pickupHour < 6 || pickupHour >= 18) { showToast(t('error_working_hours')); isValid = false; }
    if (!cart.length) { showToast(t('error_empty_cart')); isValid = false; }

    if (!isValid) {
        handleTabClick('checkout', infoSectionRef);
        return;
    }

    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        const orderId = generateOrderId();
        setOrderDetails({
            id: orderId,
            time: new Date(pickup).toLocaleString('vi-VN', {
                weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            }),
            items: cart,
            total: calculateCartTotal,
            paymentMethod: paymentMethod
        });
        showToast(t('order_created'));
        setShowConfirmationModal(true);
        
        // Clear cart and form fields after successful order
        setCart([]);
        setSpecial('');
        // Reset pickup time to 15 mins from now
        const nowReset = new Date();
        nowReset.setMinutes(nowReset.getMinutes() + 15);
        setPickup(nowReset.toISOString().slice(0,16));
        setPaymentMethod('cod'); // Reset payment method
    }, 1000);
    fetch('/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem('auth')
        },
        body: JSON.stringify({
            time: new Date(pickup).toISOString(),
            specialRequest: special,
            items: cart,
            total: calculateCartTotal,
            paymentMethod: paymentMethod
        })
        })
        .then(res => res.json())
        .then(data => {
        console.log(data.message);
        })
        .catch(error => {
        console.error(error);
        showToast(t('order_error'));
        });

};

const categories = [t('all'), ...new Set(menuItems.map(i => i.category))];

const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
};

const handleSubmitRating = () => {
    if (!selectedMenuItem) {
        showToast(t('rating_choose_item'));
        return;
    }
    if (rating === 0) {
        showToast(t('rating_choose_star'));
        return;
    }
    fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rating', itemId: parseInt(selectedMenuItem), rating, comment: reviewComment })
    }).then(() => {
        showToast(t('rating_success', {name: menuItems.find(i => i.id === parseInt(selectedMenuItem)).name, rating}));
    }).catch(() => showToast(t('rating_error')));
    setRating(0);
    setSelectedMenuItem('');
    setReviewComment('');
};

const handleSubmitFeedback = () => {
    let isValid = true;
    setFeedbackTextError('');
    setFeedbackEmailError('');

    if (!feedbackText.trim()) {
        setFeedbackTextError(t('feedback_text_required'));
        isValid = false;
    }
    if (!feedbackEmail.trim()) {
        setFeedbackEmailError(t('feedback_email_required'));
        isValid = false;
    } else if (!isValidEmail(feedbackEmail)) {
        setFeedbackEmailError(t('invalid_email'));
        isValid = false;
    }

    if (!isValid) {
        showToast(t('feedback_invalid'));
        return;
    }
    fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', text: feedbackText, email: feedbackEmail })
    }).then(() => {
        showToast(t('feedback_success'));
    }).catch(() => showToast(t('feedback_error')));
    setFeedbackText('');
    setFeedbackEmail('');
};

const handleUpdateInfo = () => {
    fetch('/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + localStorage.getItem('auth') },
        body: JSON.stringify({ fullName, staffId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) showToast(t('info_updated'));
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('staffId', staffId);
    })
    .catch(() => showToast('Lỗi'));
};

const filteredMenuItems = menuItems.filter(item => {
    const normalizedItemName = item.name.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
    const matchesSearch = searchWords.every(word => normalizedItemName.includes(word));
    const matchesCategory = selectedCategory === t('all') || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
});


return (
    <>
        {/* Navbar KHÔNG còn logo */}
        <nav className="top-navbar">
            <div className="top-navbar-inner" style={{display: 'flex', alignItems: 'center', width: 'calc(100% - 60px)'}}>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                    <div
                        className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`}
                        onClick={() => handleTabClick('menu', menuSectionRef)}>
                        <i className="fa-solid fa-utensils"></i>
                        <span>{t('menu')}</span>
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('cart', cartSectionRef)}>
                        <i className="fa-solid fa-shopping-cart"></i>
                        <span>{t('cart')}</span>
                        {cart.length > 0 && <span className="floating-cart-count" style={{position:'static', transform:'none', marginLeft:'5px'}}>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>}
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'checkout' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('checkout', infoSectionRef)}>
                        <i className="fa-solid fa-credit-card"></i>
                        <span>{t('checkout')}</span>
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('feedback', feedbackSectionRef)}>
                        <i className="fa-solid fa-comments"></i>
                        <span>{t('feedback')}</span>
                    </div>
                    <div
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => handleTabClick('settings', null)}>
                        <i className="fa-solid fa-gear"></i>
                        <span>{t('settings')}</span>
                    </div>
                </div>
            </div>
        </nav>

        {/* Floating Cart Icon */}
        {cart.length > 0 && activeTab !== 'cart' && (
            <div className="floating-cart-icon" onClick={handleFloatingCartClick}>
                <i className="fa-solid fa-cart-shopping"></i>
                <span className="floating-cart-count">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
            </div>
        )}

        {/* Trang Menu */}
        {currentPage === 'menu' && (
            <div id="menu-section" ref={menuSectionRef}>
                {/* Banner chữ nổi bật + ảnh canteen */}
                <div className="canteen-banner">
                    <div className="canteen-banner-title">
                        <span>{t('welcome')}</span>
                        <h1>{t('canteen_title')}</h1>
                        <small>{t('branch')}</small>
                    </div>
                    <img src="img/canteen.jpg" alt="Canteen HCMUS" className="canteen-img" />
                </div>
                <div className="filter-section">
                    <div className="search-input-wrapper">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="category-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {(() => {
                    const itemsGroupedByCategory = {};
                    filteredMenuItems.forEach(item => {
                        if (!itemsGroupedByCategory[item.category]) {
                            itemsGroupedByCategory[item.category] = [];
                        }
                        itemsGroupedByCategory[item.category].push(item);
                    });

                    const categoryKeys = selectedCategory === t('all') ?
                        Object.keys(itemsGroupedByCategory) :
                        (itemsGroupedByCategory[selectedCategory] ? [selectedCategory] : []);

                    if (filteredMenuItems.length === 0) {
                        return <p style={{textAlign: 'center', marginTop: '30px', fontSize: '18px', color: '#666'}}>{t('not_found')}</p>;
                    }

                    return categoryKeys.map(cat => (
                        <div key={cat} className="category">
                            {itemsGroupedByCategory[cat] && itemsGroupedByCategory[cat].length > 0 && (
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px', marginBottom: '20px', fontSize: '24px', color: '#333' }}>
                                    {cat === 'Món ăn' && <i className="fa-solid fa-burger" style={{ color: 'var(--primary-color)', fontSize: '28px' }}></i>}
                                    {cat === 'Đồ uống' && <i className="fa-solid fa-mug-saucer" style={{ color: 'var(--primary-color)', fontSize: '28px' }}></i>}
                                    {cat}
                                </h4>
                            )}
                            <div className="grid">
                                {itemsGroupedByCategory[cat].map(item => (
                                    <MenuItemCard
                                        key={item.id}
                                        item={item}
                                        add={addItemToCart}
                                        addingId={addingId}
                                        onImageClick={handleImageClick}
                                    />
                                ))}
                            </div>
                        </div>
                    ));
                })()}
            </div>
        )}

        {/* Trang Giỏ hàng */}
        {currentPage === 'cart' && (
            <div id="cart-page" style={{maxWidth: 600, margin: '40px auto'}}>
                <div className="card form-card">
                    <h2 style={{textAlign:'center'}}><i className="fa-solid fa-shopping-cart"></i> {t('your_cart')}</h2>
                    {!cart.length ? (
                        <p style={{textAlign:'center'}}>{t('empty_cart')}</p>
                    ) : (
                        <>
                            <ul className="cart-list">
                                {cart.map((item, idx) => (
                                    <CartItem 
                                        key={item.id}
                                        item={item} 
                                        idx={idx} 
                                        updateQuantity={updateItemQuantity} 
                                        removeItem={removeItemFromCart} 
                                    />
                                ))}
                            </ul>
                            <p style={{textAlign:'right', fontWeight:'bold', fontSize:'18px'}}>{t('total')}: {calculateCartTotal.toLocaleString()}đ</p>
                            <button className="btn payment-btn" onClick={handleGoToCheckout} disabled={!cart.length}>
                                <i className="fa-solid fa-credit-card"></i> {t('checkout_btn')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}

        {/* Trang Thanh toán */}
        {currentPage === 'checkout' && (
            <div id="info-section" ref={infoSectionRef}>
                <div className="middle-section">
                    {/* Chọn thời gian lấy món */}
                    <div className="card form-card relative">
                        {loading && <div className="form-overlay"><span className="spinner"></span></div>}
                        <h3><i className="fa-solid fa-clock"></i>{t('choose_time')}</h3>
                        <input type="datetime-local" value={pickup} min={new Date().toISOString().slice(0,16)} max={new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString().slice(0,16)} onChange={e=>setPickup(e.target.value)}/>
                    </div>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <div className="card form-card relative">
                        {loading && <div className="form-overlay"><span className="spinner"></span></div>}
                        <h3><i className="fa-solid fa-money-bill-wave"></i>{t('payment_method')}</h3>
                        <div className="payment-methods">
                            {/* Chỉ còn Momo và VietQR */}
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="momo"
                                    checked={paymentMethod === 'momo'}
                                    onChange={() => setPaymentMethod('momo')}
                                />
                                <img src="img/momo_logo.png" alt="Momo Logo" onError={(e)=>{e.target.onerror = null; e.target.src='https://firebasestorage.googleapis.com/v0/b/YOUR_FIREBASE_PROJECT_ID/o/img%2Fmomo_logo.png?alt=media&token=YOUR_MOMO_LOGO_TOKEN';}} />
                                <span>{t('pay_momo')}</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="vietqr"
                                    checked={paymentMethod === 'vietqr'}
                                    onChange={() => setPaymentMethod('vietqr')}
                                />
                                <img src="img/vietqr_logo.png" alt="VietQR Logo" onError={(e)=>{e.target.onerror = null; e.target.src='https://firebasestorage.googleapis.com/v0/b/YOUR_FIREBASE_PROJECT_ID/o/img%2Fvietqr_logo.png?alt=media&token=YOUR_VIETQR_LOGO_TOKEN';}} />
                                <span>{t('pay_vietqr')}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Thông tin người đặt */}
                <div className="card form-card">
                    <h3><i className="fa-solid fa-user"></i>{t('customer')}</h3>
                    <p>{localStorage.getItem('fullName')}</p>
                </div>

                {/* Yêu cầu đặc biệt */}
                <div className="card form-card relative">
                    {loading && <div className="form-overlay"><span className="spinner"></span></div>}
                    <h3><i className="fa-solid fa-note-sticky"></i>{t('special_request')}</h3>
                    <textarea rows={2} placeholder={t('special_placeholder')} value={special} onChange={e=>setSpecial(e.target.value)}></textarea>
                </div>

                <button className="btn payment-btn" onClick={handleCheckout} disabled={loading || !cart.length}>
                    {loading?<span className="spinner"></span>:t('pay_and_order')}
                </button>
            </div>
        )}

        {/* Trang Góp ý */}
        {currentPage === 'feedback' && (
            <div id="feedback-section" ref={feedbackSectionRef}>
                {/* Bản đồ vị trí trường */}
                <div className="feedback-map-container">
                    <iframe
                        title="Bản đồ ĐH Khoa học Tự nhiên TP.HCM"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.631779846698!2d106.67990211139288!3d10.762835589340861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1750705675895!5m2!1svi!2s"
                        width="100%"
                        height="320"
                        style={{border:0, borderRadius:'12px'}}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                {/* Đánh giá món ăn và Góp ý & Liên hệ (sẽ tự động xếp chồng trên mobile) */}
                <div className="bottom-section feedback-row">
                    <div className="card form-card">
                        <h3><i className="fa-solid fa-star"></i>{t('rate_dish')}</h3>
                        <select style={{width:'100%',padding:10,marginTop:12, marginBottom: 12}} value={selectedMenuItem} onChange={(e) => setSelectedMenuItem(e.target.value)}>
                            <option value="">{t('choose_dish')}</option>
                            {menuItems.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                        <div className="star-rating">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <React.Fragment key={star}>
                                    <input
                                        type="radio"
                                        id={`star${star}`}
                                        name="rating"
                                        value={star}
                                        checked={rating === star}
                                        onChange={handleRatingChange}
                                    />
                                    <label htmlFor={`star${star}`} title={`${star} sao`}></label>
                                </React.Fragment>
                            ))}
                        </div>
                        <textarea
                            rows={3}
                            placeholder={t('comment_placeholder')}
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                        ></textarea>
                        {/* Nút gửi đánh giá */}
                        <div className="feedback-btn-row">
                            <button className="btn" onClick={handleSubmitRating}>{t('submit_rating')}</button>
                        </div>
                    </div>

                    <div className="card form-card">
                        <h3><i className="fa-solid fa-comments"></i>{t('feedback_contact')}</h3>
                        <div className="form-group">
                            <textarea
                                rows={4}
                                placeholder={t('feedback_placeholder')}
                                value={feedbackText}
                                onChange={e => {setFeedbackText(e.target.value); setFeedbackTextError('');}}
                            ></textarea>
                            {feedbackTextError && <span className="error-message">{feedbackTextError}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder={t('email_placeholder')}
                                value={feedbackEmail}
                                onChange={e => {setFeedbackEmail(e.target.value); setFeedbackEmailError('');}}
                            />
                            {feedbackEmailError && <span className="error-message">{feedbackEmailError}</span>}
                        </div>
                        {/* Nút gửi góp ý */}
                        <div className="feedback-btn-row" style={{marginTop:32}} >
                            <button className="btn" onClick={handleSubmitFeedback}>{t('submit_feedback')}</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Trang Cài đặt */}
        {currentPage === 'settings' && (
            <div style={{maxWidth:400, margin:'80px auto'}}>
                <div className="card form-card" style={{marginBottom:20}}>
                    <h3>{t('interface_settings')}</h3>
                    <label className="toggle-switch" style={{marginBottom:12}}>
                        <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                        <span className="slider"></span>
                        <span style={{marginLeft:8}}>{t('dark_mode')}</span>
                    </label>
                    <div style={{marginBottom:12}}>
                        <select value={language} onChange={e => setLanguage(e.target.value)}>
                            <option value="vi">{t('vietnamese')}</option>
                            <option value="en">{t('english')}</option>
                        </select>
                    </div>
                </div>
                <div className="card form-card">
                    <h3>{t('account_settings')}</h3>
                    <div className="form-group">
                        <label>{t('full_name')}</label>
                        <input value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div className="form-group" style={{marginBottom:16}}>
                        <label>{t('staff_id')}</label>
                        <input value={staffId} onChange={e => setStaffId(e.target.value)} />
                    </div>
                    <button className="btn" onClick={handleUpdateInfo} style={{marginBottom:12}}>{t('update_info')}</button>
                    <button className="btn" onClick={() => window.location.href='/change'} style={{marginBottom:12}}>
                        {t('change_password')}
                    </button>
                    <button className="btn danger-btn" onClick={handleLogout}>{t('logout')}</button>
                </div>
            </div>
        )}

        {showConfirmationModal && (
            <ConfirmationModal
                orderDetails={orderDetails}
                onClose={() => setShowConfirmationModal(false)}
            />
        )}

        {arItem && (
            <ModelViewerModal
                model={arItem.model}
                onClose={() => setArItem(null)}
            />
        )}

        <div className="footer">
            <div className="footer-logo">
                <img src="img/HCMUS.png" alt="ĐHQG-HCM Logo" />
            </div>
            <p>&copy; {new Date().getFullYear()} Canteen KHTN Nguyễn Văn Cừ. All rights reserved.</p>
            <p>Phát triển bởi: Hồ Sĩ Phú, Phạm Hùng Tiến, Phạm Cao Bằng, Trần Thái Nguyên, Lê Quang Bảo Trung.</p>
        </div>
    </>
);
}

// Đã sửa lỗi: Cập nhật ReactDOM.render sang ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
