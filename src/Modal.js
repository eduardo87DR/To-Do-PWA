import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, PlusCircle, Trash2, Info } from "lucide-react";

function Modal({ isOpen, onClose, title, icon, children }) {
  const iconMap = {
    plus: <PlusCircle color="#4f46e5" size={42} />,
    check: <CheckCircle color="#16a34a" size={42} />,
    trash: <Trash2 color="#dc2626" size={42} />,
    info: <Info color="#6366f1" size={42} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <div className="modal-header">
              {iconMap[icon] || iconMap.info}
              <h3>{title}</h3>
            </div>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
