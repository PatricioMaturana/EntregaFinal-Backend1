export function notificacionToastify(text){
    Toastify({
        text: text,
        duration: 3000,
        //destination: "https://github.com/apvarun/toastify-js",
        //newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

export function alertaPopUp(icon, titulo, texto){
    Swal.fire({
        icon: icon,
        title: titulo,
        text: texto
    });
}