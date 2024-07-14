const baseURL = 'https://service.newtimes.az/api/service/search-photo/small'
const baseURL2 = 'https://api.newtimes.az/api/'

//name inputmuzu gotururk
const name =document.forms.categoryForm.name 
const searchBtn =document.querySelector("#search-btn")
const imgContainer =document.querySelector(".img-container")
const form =document.querySelector("form[name=categoryForm]")



name.addEventListener('keyup',e=>{
    // inputun valuesini goturuk 
    const value= e.target.value 
    if(value){
    searchBtn.disabled=false; //deyeri varsa 
    }else{
        searchBtn.disabled=true;
    }
})

//imglerimizi formdan table kocurmek ucun 



// search edende img ekrana cixardir datalardan
searchBtn.addEventListener("click", async()=>{
    // inputmuzun deyerini goturub api request atiriq 
   const value= name.value
  const data =await axios.get(baseURL,{
    headers: {
        Authorization:`Bearer ${localStorage.getItem('token')}`
    },
    params: {
        keyword:value
    }
  })
  let innerHTML= ""
  data.data.data.small_urls.forEach(item=>{
    innerHTML+= `<img onclick="setImage(${item})" src="${item}" width="100px" height="100px"/>`
  })
  imgContainer.innerHTML=innerHTML
})

form.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const categoryForm =document.forms.categoryForm
    const name =categoryForm.name.value
    const type =categoryForm.type.value
    try {
        await axios.post(`${baseURL2}}dashboard/categories/store`,{
            //formdan goturduyumuz name ve type gonderirik
            name,
            type,
        },{
            headers: {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        })
        localStorage.href="index.html"
    } catch (e) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
        swalWithBootstrapButtons.fire({
            title: "Error",
            //backendden gelen mesaj
            text: e.response.data.message ,
            icon: "error"
          }); 
    }
})