const MenuItemCard = ({ item, add, addingId, onImageClick }) => {
  const original = item.originalPrice || item.price;
  const discount = original > item.price
    ? Math.round(((original - item.price) / original) * 100)
    : 0;
  return (
    <div key={item.id} className="card">
      <div className="image-container" onClick={() => onImageClick && onImageClick(item)}>
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className="ar-hint">{t('tap_image_ar')}</span>
      </div>
      <div className="card-content">
        <h3>{item.name}</h3>
        <div style={{ color: '#f5a623', marginBottom: 8 }}>
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className="fa-solid fa-star"
              style={{ color: i < item.rating ? '#ffc107' : '#ccc' }}
            ></i>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <div className="price-info">
          <span className="original-price">{original.toLocaleString()}đ</span>
          <div className="price-and-discount">
            <p className="price">{item.price.toLocaleString()}đ</p>
            {discount > 0 && (
              <span className="discount-percentage">-{discount}%</span>
            )}
          </div>
        </div>
        {addingId === item.id ? (
          <span className="spinner"></span>
        ) : (
          <div className="add-icon" onClick={() => add(item)}>
            <i className="fa-solid fa-cart-plus"></i>
          </div>
        )}
      </div>
    </div>
  );
};
