const { useState, useEffect, useRef } = React;

const defaultMenu = [
  { id: 1, category: 'Món ăn', name: 'Cơm phần thịt kho', price: 25000, originalPrice: 30000, image: 'menu/com_thit_kho.jpg', rating: 4 },
  { id: 2, category: 'Món ăn', name: 'Bánh mì ốp la', price: 20000, originalPrice: 25000, image: 'menu/banh_mi_op_la.jpg', rating: 3 },
  { id: 3, category: 'Món ăn', name: 'Salad healthy', price: 30000, originalPrice: 35000, image: 'menu/salad_healthy.jpg', rating: 5 },
  { id: 4, category: 'Món ăn', name: 'Cơm tấm sườn', price: 28000, originalPrice: 32000, image: 'menu/com_tam_suon.jpg', rating: 4 },
  { id: 5, category: 'Món ăn', name: 'Phở bò', price: 30000, originalPrice: 38000, image: 'menu/pho_bo.jpg', rating: 5 },
  { id: 6, category: 'Món ăn', name: 'Bún chả', price: 35000, originalPrice: 38000, image: 'menu/bun_cha.jpg', rating: 4 },
  { id: 10, category: 'Đồ uống', name: 'Trà sữa', price: 20000, originalPrice: 23000, image: 'menu/tra_sua.jpg', rating: 4 },
  { id: 11, category: 'Đồ uống', name: 'Cà phê sữa đá', price: 15000, originalPrice: 18000, image: 'menu/ca_phe_sua_da.jpg', rating: 3 },
  { id: 12, category: 'Đồ uống', name: 'Nước ép detox', price: 15000, originalPrice: 18000, image: 'menu/nuoc_ep_detox.jpg', rating: 5 },
  { id: 13, category: 'Đồ uống', name: 'Nước cam vắt', price: 18000, originalPrice: 22000, image: 'menu/nuoc_cam_vat.jpg', rating: 4 },
  { id: 14, category: 'Đồ uống', name: 'Nước mía', price: 12000, originalPrice: 15000, image: 'menu/nuoc_mia.jpg', rating: 3 },
  { id: 15, category: 'Đồ uống', name: 'Sữa chua nếp cẩm', price: 25000, originalPrice: 28000, image: 'menu/sua_chua_nep_cam.jpg', rating: 5 }
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

const [feedbackTextError, setFeedbackTextError] = useState('');
const [feedbackEmailError, setFeedbackEmailError] = useState('');

const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Tất cả');

const [showConfirmationModal, setShowConfirmationModal] = useState(false);
const [orderDetails, setOrderDetails] = useState(null);
const [paymentMethod, setPaymentMethod] = useState('cod');

const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
};

useEffect(() => {
    if (!localStorage.getItem('auth')) {
        window.location.href = '/login.html';
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
        showToast(`Đã thêm ${item.name} vào giỏ hàng`);
        setAddingId(null);
        // XÓA DÒNG NÀY ĐỂ NGĂN TỰ ĐỘNG CUỘN ĐẾN GIỎ HÀNG:
        // handleTabClick('cart', cartSectionRef); 
    }, 300);
};

const removeItemFromCart = (index) => setCart(prev => prev.filter((_, idx) => idx !== index));

const updateItemQuantity = (index, delta) => setCart(prev => 
    prev.map((x, idx) => idx === index ? { ...x, qty: Math.max(1, Math.min(10, x.qty + delta)) } : x)
);

const calculateCartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateOrderId = () => 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

const handleCheckout = () => {
    let isValid = true;
    const pickupDate = new Date(pickup);
    const now = new Date();
    const maxAllowedDate = new Date(now.getTime() + 30 * 24 * 60 * 60000);

    if (pickupDate < now) { showToast('Không thể đặt món vào thời gian trong quá khứ!'); isValid = false; }
    if (pickupDate > maxAllowedDate) { showToast('Chỉ được đặt món trong vòng 30 ngày tới!'); isValid = false; }
    const pickupHour = pickupDate.getHours();
    if (pickupHour < 6 || pickupHour >= 18) { showToast('Chỉ đặt món trong khung giờ 6:00 – 18:00!'); isValid = false; }
    if (!cart.length) { showToast('Giỏ hàng của bạn đang trống!'); isValid = false; }

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
        showToast('Đơn hàng đã được tạo. Vui lòng kiểm tra thông tin!');
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
        showToast('Có vấn đề khi ghi nhận đơn hàng!');
        });

};

const categories = ['Tất cả', ...new Set(menuItems.map(i => i.category))];

const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
};

const handleSubmitRating = () => {
    if (!selectedMenuItem) {
        showToast('Vui lòng chọn món để đánh giá!');
        return;
    }
    if (rating === 0) {
        showToast('Vui lòng chọn số sao để đánh giá!');
        return;
    }
    fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rating', itemId: parseInt(selectedMenuItem), rating, comment: reviewComment })
    }).then(() => {
        showToast(`Bạn đã đánh giá món "${menuItems.find(i => i.id === parseInt(selectedMenuItem)).name}" ${rating} sao. Cảm ơn!`);
    }).catch(() => showToast('Có lỗi khi gửi đánh giá'));
    setRating(0);
    setSelectedMenuItem('');
    setReviewComment('');
};

const handleSubmitFeedback = () => {
    let isValid = true;
    setFeedbackTextError('');
    setFeedbackEmailError('');

    if (!feedbackText.trim()) {
        setFeedbackTextError('Vui lòng nhập nội dung góp ý!');
        isValid = false;
    }
    if (!feedbackEmail.trim()) {
        setFeedbackEmailError('Vui lòng nhập email để nhận phản hồi!');
        isValid = false;
    } else if (!isValidEmail(feedbackEmail)) {
        setFeedbackEmailError('Email không hợp lệ!');
        isValid = false;
    }

    if (!isValid) {
        showToast('Vui lòng kiểm tra lại thông tin góp ý.');
        return;
    }
    fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', text: feedbackText, email: feedbackEmail })
    }).then(() => {
        showToast('Cảm ơn ý kiến đóng góp của bạn! Chúng tôi sẽ phản hồi qua email.');
    }).catch(() => showToast('Không gửi được góp ý!'));
    setFeedbackText('');
    setFeedbackEmail('');
};

const filteredMenuItems = menuItems.filter(item => {
    const normalizedItemName = item.name.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
    const matchesSearch = searchWords.every(word => normalizedItemName.includes(word));
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
});


return (
    <>
        {/* Navbar KHÔNG còn logo */}
        <nav className="top-navbar">
            <div className="top-navbar-inner" style={{display: 'flex', alignItems: 'center', width: '90%'}}>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                    <div 
                        className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('menu', menuSectionRef)}>
                        <i className="fa-solid fa-utensils"></i>
                        <span>Menu</span>
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('cart', cartSectionRef)}>
                        <i className="fa-solid fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        {cart.length > 0 && <span className="floating-cart-count" style={{position:'static', transform:'none', marginLeft:'5px'}}>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>}
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'checkout' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('checkout', infoSectionRef)}>
                        <i className="fa-solid fa-credit-card"></i>
                        <span>Thanh toán</span>
                    </div>
                    <div 
                        className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('feedback', feedbackSectionRef)}>
                        <i className="fa-solid fa-comments"></i>
                        <span>Góp ý</span>
                    </div>
                </div>
            </div>
        </nav>
        <button className="btn logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
        </button>

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
                        <span>Chào mừng đến với</span>
                        <h1>Canteen HCMUS!</h1>
                        <small>(Cơ sở Nguyễn Văn Cừ)</small>
                    </div>
                    <img src="img/canteen.jpg" alt="Canteen HCMUS" className="canteen-img" />
                </div>
                <div className="filter-section">
                    <div className="search-input-wrapper">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
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

                    const categoryKeys = selectedCategory === 'Tất cả' ?
                        Object.keys(itemsGroupedByCategory) :
                        (itemsGroupedByCategory[selectedCategory] ? [selectedCategory] : []);

                    if (filteredMenuItems.length === 0) {
                        return <p style={{textAlign: 'center', marginTop: '30px', fontSize: '18px', color: '#666'}}>Không tìm thấy món ăn nào khớp với tiêu chí của bạn.</p>;
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
                    <h2 style={{textAlign:'center'}}><i className="fa-solid fa-shopping-cart"></i> Giỏ hàng của bạn</h2>
                    {!cart.length ? (
                        <p style={{textAlign:'center'}}>Chưa có sản phẩm trong giỏ hàng.</p>
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
                            <p style={{textAlign:'right', fontWeight:'bold', fontSize:'18px'}}>Tổng cộng: {calculateCartTotal.toLocaleString()}đ</p>
                            <button className="btn payment-btn" onClick={handleGoToCheckout} disabled={!cart.length}>
                                <i className="fa-solid fa-credit-card"></i> Thanh toán
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
                        <h3><i className="fa-solid fa-clock"></i>Chọn thời gian lấy món</h3>
                        <input type="datetime-local" value={pickup} min={new Date().toISOString().slice(0,16)} max={new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString().slice(0,16)} onChange={e=>setPickup(e.target.value)}/>
                    </div>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <div className="card form-card relative">
                        {loading && <div className="form-overlay"><span className="spinner"></span></div>}
                        <h3><i className="fa-solid fa-money-bill-wave"></i>Phương thức thanh toán</h3>
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
                                <span>Thanh toán qua Momo</span>
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
                                <span>Thanh toán qua VietQR (Ngân hàng)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Thông tin người đặt */}
                <div className="card form-card">
                    <h3><i className="fa-solid fa-user"></i>Người đặt</h3>
                    <p>{localStorage.getItem('fullName')}</p>
                </div>

                {/* Yêu cầu đặc biệt */}
                <div className="card form-card relative">
                    {loading && <div className="form-overlay"><span className="spinner"></span></div>}
                    <h3><i className="fa-solid fa-note-sticky"></i>Yêu cầu đặc biệt</h3>
                    <textarea rows={2} placeholder="Ví dụ: Cà phê ít đường, không đá,..." value={special} onChange={e=>setSpecial(e.target.value)}></textarea>
                </div>

                <button className="btn payment-btn" onClick={handleCheckout} disabled={loading || !cart.length}>
                    {loading?<span className="spinner"></span>:'Thanh toán và đặt món'}
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
                        <h3><i className="fa-solid fa-star"></i>Đánh giá món ăn</h3>
                        <select style={{width:'100%',padding:10,marginTop:12, marginBottom: 12}} value={selectedMenuItem} onChange={(e) => setSelectedMenuItem(e.target.value)}>
                            <option value="">Chọn món để đánh giá</option>
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
                            placeholder="Cảm nhận của bạn (không bắt buộc)"
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                        ></textarea>
                        {/* Nút gửi đánh giá */}
                        <div className="feedback-btn-row">
                            <button className="btn" onClick={handleSubmitRating}>Gửi đánh giá</button>
                        </div>
                    </div>

                    <div className="card form-card">
                        <h3><i className="fa-solid fa-comments"></i>Góp ý và Liên hệ</h3>
                        <div className="form-group">
                            <textarea
                                rows={4}
                                placeholder="Nội dung góp ý của bạn..."
                                value={feedbackText}
                                onChange={e => {setFeedbackText(e.target.value); setFeedbackTextError('');}}
                            ></textarea>
                            {feedbackTextError && <span className="error-message">{feedbackTextError}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email của bạn (để nhận phản hồi)"
                                value={feedbackEmail}
                                onChange={e => {setFeedbackEmail(e.target.value); setFeedbackEmailError('');}}
                            />
                            {feedbackEmailError && <span className="error-message">{feedbackEmailError}</span>}
                        </div>
                        {/* Nút gửi góp ý */}
                        <div className="feedback-btn-row" style={{marginTop:32}} >
                            <button className="btn" onClick={handleSubmitFeedback}>Gửi góp ý</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showConfirmationModal && (
            <ConfirmationModal 
                orderDetails={orderDetails} 
                onClose={() => setShowConfirmationModal(false)} 
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
