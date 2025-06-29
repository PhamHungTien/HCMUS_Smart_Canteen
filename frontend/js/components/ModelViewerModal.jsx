const ModelViewerModal = ({ model, onClose }) => {
  if (!model) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{width:'90%',maxWidth:'600px',height:'80vh'}} onClick={e=>e.stopPropagation()}>
        <model-viewer src={model} ar ar-modes="webxr scene-viewer quick-look" camera-controls autoplay style={{width:'100%',height:'100%'}}></model-viewer>
        <button className="btn modal-close-btn" style={{marginTop:10}} onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};
