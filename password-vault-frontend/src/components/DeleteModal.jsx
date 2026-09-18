import "./DeleteModal.css";

function DeleteModal({ isOpen, onClose, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Delete Credential</h2>

        <p>
          Are you sure you want to delete this credential?
          This action cannot be undone.
        </p>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteModal;