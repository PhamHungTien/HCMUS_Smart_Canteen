const ModelViewerModal = ({ item, onClose, onAdd }) => {
  const [scale, setScale] = React.useState(0.5); // mặc định nhỏ nhất
  if (!item) return null;
  const adjust = (d) => {
    setScale(s => {
      let v = parseFloat((s + d).toFixed(2));
      if (v < 0.5) v = 0.5;
      if (v > 3) v = 3;
      return v;
    });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{width:'90%',maxWidth:'600px',height:'80vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <model-viewer src={item.model} ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed" camera-controls autoplay style={{flex:1,transform:`scale(${scale})`,transition:'transform 0.2s ease-out'}}></model-viewer>
        <div style={{marginTop:10,display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
          <button className="btn" onClick={() => adjust(-0.1)}>-</button>
          <span>{Math.round(scale*100)}%</span>
          <button className="btn" onClick={() => adjust(0.1)}>+</button>
        </div>
        <div style={{marginTop:10,display:'flex',justifyContent:'center',gap:'10px'}}>
          <button className="btn" onClick={() => { onAdd && onAdd(item); onClose(); }}>{t('add_to_cart_btn')}</button>
          <button className="btn modal-close-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
