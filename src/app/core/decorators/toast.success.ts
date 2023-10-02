import Swal from 'sweetalert2';

export function ToastNotif(icon: 'success' | 'error' | 'info' | 'warning', message: string) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon, // Gunakan ikon yang diberikan sebagai parameter
    title: message,
  });
}
