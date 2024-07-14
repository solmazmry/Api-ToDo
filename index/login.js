const baseURL='https://api.newtimes.az/api'
const form =document.querySelector('form')

form.addEventListener('submit',async (e)=>{
    e.preventDefault()

    const form = document.forms['login-form']
    try {
        const data = await axios.post(`${baseURL}/login`,{
            email:form.email.value,
            password:form.password.value
        })

        // 201 statusu gelse gonder indexedDB.html 
        if(data.status === 201) {
            localStorage.setItem('token',data.data.data.token)
            location.href = 'index.html'
            Toastify({
                text: data.data.message,
                duration: 1000,
                close: true,
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "green",
                },
            }).showToast();
        }
    } catch (e) {
        const message =e.response.data.message 
        Toastify({
            text: message,
            duration: 1000,
            close: true,
            position: "right",
            stopOnFocus: true,
            style: {
                background: "red",
            },
        }).showToast();
    }
})






