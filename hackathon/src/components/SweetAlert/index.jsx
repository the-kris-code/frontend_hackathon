import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SweetAlert = () => {
  const showSuccess = (title, text) => {
    MySwal.fire({
      icon: "success",
      title: title || "Sucesso!",
      text: text || "",
      confirmButtonColor: "#3085d6",
    });
  };

  const showError = (title, text) => {
    MySwal.fire({
      icon: "error",
      title: title || "Erro!",
      text: text || "",
      confirmButtonColor: "#d33",
    });
  };

  const showWarning = (title, text) => {
    MySwal.fire({
      icon: "warning",
      title: title || "Atenção!",
      text: text || "",
      confirmButtonColor: "#f39c12",
    });
  };

  const showConfirm = async (title, text, onConfirm) => {
    const result = await MySwal.fire({
      icon: "question",
      title: title || "Tem certeza?",
      text: text || "",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
    });

    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  };

  // Esse componente não renderiza nada visual
  return null;
};

// 👇 Exporta funções para usar em qualquer lugar
export const Alert = {
  success: (title, text) => {
    MySwal.fire({
      icon: "success",
      title: title || "Sucesso!",
      text: text || "",
    });
  },

  error: (title, text) => {
    MySwal.fire({
      icon: "error",
      title: title || "Erro!",
      text: text || "",
    });
  },

  warning: (title, text) => {
    MySwal.fire({
      icon: "warning",
      title: title || "Atenção!",
      text: text || "",
    });
  },

  confirm: async (title, text) => {
    return await MySwal.fire({
      icon: "question",
      title: title || "Tem certeza?",
      text: text || "",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });
  },
};

export default SweetAlert;