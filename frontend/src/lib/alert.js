import Swal from "sweetalert2";

export const showSuccess = (message) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonText: "OK",
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "OK",
  });
};

export const showConfirm = ({ title, text, confirmText = "Yes" }) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
  });
};
