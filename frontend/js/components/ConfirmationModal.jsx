const ConfirmationModal = ({ orderDetails, onClose }) => {
  const barcodeRef = React.useRef(null);

  React.useEffect(() => {
    if (orderDetails?.id && barcodeRef.current) {
      JsBarcode(barcodeRef.current, orderDetails.id, {
        format: 'CODE128',
        displayValue: true,
        height: 60,
        width: 2,
        margin: 10,
        textMargin: 5,
      });
    }
  }, [orderDetails?.id]);

  const handleSaveBarcode = () => {
    if (!barcodeRef.current) return;
    const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = png;
      link.download = `ma_don_hang_${orderDetails.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Đã lưu ảnh mã vạch!');
    };
    img.src = url;
  };

  if (!orderDetails) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>
          <i className="fa-solid fa-circle-check success-icon"></i>
          Đơn hàng đã tạo
        </h3>
        <p>
          <strong>Mã đơn:</strong> {orderDetails.id}
        </p>
        <p>
          <strong>Thời gian nhận:</strong> {orderDetails.time}
        </p>
        <ul>
          {orderDetails.items.map(item => (
            <li key={item.id}>
              <span>
                {item.name} x{item.qty}
              </span>
              <strong>
                {(item.price * item.qty).toLocaleString()}đ
              </strong>
            </li>
          ))}
        </ul>
        <p className="total-price">
          {t('total')}: {orderDetails.total.toLocaleString()}đ
        </p>
        <div className="barcode-container">
          <svg ref={barcodeRef}></svg>
        </div>
        <p className="pickup-instruction">
          Vui lòng mang mã vạch đến quầy để nhận món.
        </p>
        <div className="modal-button-group">
          <button className="btn modal-save-barcode-btn" onClick={handleSaveBarcode}>
            Lưu mã vạch
          </button>
          <button className="btn modal-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
