import Swal from "sweetalert2";
import "animate.css";

function ResponseAlert(response, alertDetails) {
    if (response.responseCode === 200 || response.responseCode === 201) {
        return (
            Swal.fire({
                text: alertDetails.text,
                icon: alertDetails.successIcon,
                confirmButtonColor: "#28a745",
                customClass: {
                    confirmButton: alertDetails.confirmButtonClass,
                },
                showClass: {
                    popup: `
            animate__animated
            animate__fadeInDown
            animate__faster
          `,
                },
                hideClass: {
                    popup: `
            animate__animated
            animate__fadeOutUp
            animate__faster
          `,
                },
            })
        )
    }
    if (response.responseCode === 404 || response.responseCode === 401) {
        return (
            Swal.fire({
                title: "Error",
                text: `${response.message}`,
                icon: "error",
                showClass: {
                    popup: `
            animate__animated
            animate__fadeInDown
            animate__faster
          `,
                },
                hideClass: {
                    popup: `
            animate__animated
            animate__fadeOutUp
            animate__faster
          `,
                },
            })
        )
    }
}

export default ResponseAlert;