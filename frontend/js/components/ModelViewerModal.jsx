const ModelViewerModal = ({ item, onClose, onAdd }) => {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{width:'90%',maxWidth:'600px',height:'80vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <model-viewer src={item.model} ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" camera-controls autoplay style={{flex:1}}></model-viewer>
        <div style={{marginTop:10,display:'flex',justifyContent:'center',gap:'10px'}}>
          <button className="btn" onClick={() => { onAdd && onAdd(item); onClose(); }}>{t('add_to_cart_btn')}</button>
          <button className="btn modal-close-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
