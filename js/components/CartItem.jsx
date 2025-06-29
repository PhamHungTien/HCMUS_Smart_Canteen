const CartItem = ({ item, idx, updateQuantity, removeItem }) => (
  <li key={item.id}>
    <span>
      {item.name} x{item.qty} - {(item.price * item.qty).toLocaleString()}đ
    </span>
    <div className="quantity-control">
      <button
        className="btn"
        onClick={() => updateQuantity(idx, -1)}
        disabled={item.qty <= 1}
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <span>{item.qty}</span>
      <button
        className="btn"
        onClick={() => updateQuantity(idx, 1)}
        disabled={item.qty >= 10}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      <button className="btn remove-item-btn" onClick={() => removeItem(idx)}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  </li>
);
