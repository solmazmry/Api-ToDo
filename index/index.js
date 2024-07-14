const baseURL = 'https://api.newtimes.az/api/'
const tbody = document.querySelector('tbody')
const pagination = document.querySelector('.pagination');
const filterForm =document.querySelector('form[name=filterForm]')
const resetBtn =document.querySelector('button[type=reset]')

let activePage = 1

//sehfelere kecid ucun 
const changePage=(index)=>{
    activePage =index +1

    getCategories()
}
//geri cevirmek sehveni 
const prevPage =()=>{
    if(activePage-1>0){
        activePage=activePage-1 
        getCategories()
        //disabled edirik 
    }else{
        document.querySelector('#next-btn').classList.add('disabled')
    }
}

const nextPage =(pages)=>{
    if(activePage+1<= pages){
        activePage=activePage+1
        getCategories()
    }else{
        document.querySelector('#next-btn').classList.add('disabled')
    }
}



// id deye parametr oturuk onclickede delete ucun
const openConfirm= (id)=>{
    // sweetalert kitabxanasi
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then( async (result) => {
    if (result.isConfirmed) {
    //  APi request atiriq 
  try {
    // token gotururem niye?
    const token =localStorage.getItem('token')
    //datadan gelem mesaji goturmek ucun 
    const data =await axios.delete(`${baseURL}dashboard/categories/delete/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    getCategories()
    swalWithBootstrapButtons.fire({
        title: "Deleted!",
        // datadan gelen mesaji oturuk 
        text: data.data.message,
        icon: "success"
      });
  } catch (e) {
    swalWithBootstrapButtons.fire({
        title: "Error",
        //backendden gelen mesaj
        text: e.response.data.message ,
        icon: "error"
      });
  }

     
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
        });
    }
  });


}











const getCategories =async (params={})=>{
    console.log(params);
    //tokenleri gotururuk
    const token =localStorage.getItem('token')
    try {
    // activePage data menimsedirik ve gotururuk get ile API istek atiriq
    const data = await axios.get(`${baseURL}dashboard/categories/index?limit=10&page=${activePage}`,{
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            // limit:10,
            // page:activePage,
            //filter ucun parametrimizi oturuk
            ...params
        }
       }) 
       // total = datalarimizin sayi
        const total = data.data.meta.total
        document.querySelector('.page-title span').textContent = total
        const categories = data.data.data.categories
        // 1 sehveye 10 data olsun
        const pages =Math.ceil(total/10)

        //sehveni evvel array edib sonra forEach edirik 1,2,3,4... duymelerini qoyuruq
        let paginationInnerHTML = ''
        Array.from({length:pages}).forEach((_,index) => {
            paginationInnerHTML += `<li onclick="changePage(${index})" class="page-item ${activePage === index + 1 ? 'active' : ''}"><a class="page-link" href="#">${index + 1}</a></li>`
        })

         //next ve prev btnlarimiza sehveleri menimsedirik
         if(categories.length){  //ekrandan catogorilerimiz varsa goster
            pagination.innerHTML = `<li class="page-item" id="prev-btn" onclick="prevPage(${pages})"><a class="page-link" href="#">Previous</a></li>
    ${paginationInnerHTML}
 <li class="page-item" id="next-btn" onclick="nextPage(${pages})"><a class="page-link" href="#">Next</a></li>`
         }else{
            pagination.innerHTML=""  //bosh stringe menimsedirik
         }

     let innerHTML=''
     categories.forEach(item =>{
        innerHTML += `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.type === 2 ? 'ChatGPT' : 'Main'}</td>
            <td>${item.image ? `<img src="${item.image}" width="100px" height="100px" style="object-fit: cover"/>` : ''}</td>
            <td>${dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}</td>
            <td>
            <button class="btn btn-danger" onclick="openConfirm(${item.id})">
            <span class="fa fa-trash"></span>
            </button>
            <button class="btn btn-success">
            <span class="fa fa-pen"></span>
            </button>
            </td>
</tr>`
     })
    tbody.innerHTML=innerHTML

    } catch (e) {
        console.log(e);
    }finally{
        //Loading ucun
        document.querySelector('#loader').style.display='none'
    }
}
 

// filter edirik 
filterForm.addEventListener("submit",e =>{
e.preventDefault()
//formlarin icinden filter formu gotur name deyerini gotur 
const name=document.forms.filterForm.name.value
const type=document.forms.filterForm.type.value
// getCategories parametr otururuk params deye
//objenck yaradiriq 
getCategories({name,type})
})

//searchdan sonra reset ile evvelki halina getiririk
resetBtn.addEventListener("click",()=>{
    getCategories()
})









// girish edirik 
document.addEventListener('DOMContentLoaded', async ()=>{
    const token =localStorage.getItem('token')
    //eger token yoxdurda login.html at
    if(!token) {
        location.href = 'login.html'
        return
    }

    try {
        // API istek atirik datani goturuk 
        const data = await axios.get(`${baseURL}authUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       //istifadecini gotururuk navbara Welcome yazdiriq 
       const user = data.data.data.user
        document.querySelector('.navbar-brand').textContent = `Welcome ${user.name}`

    } catch (e) {
        // eger responsedan status 401 elerse 
        if(e.response.status===401){
            // tokenleri sil ve login sehvesine qayit
            localStorage.removeItem("token")
            location.href = 'login.html'
        }
    }
    getCategories()
})











