const search=document.querySelector('[search]');
const user=document.querySelector('[user]');
const key='5e36b62e7d23713ae04b9e140bb1c54b';
const grant=document.querySelector('[grant]');
const load=document.querySelector('[load]');
const info=document.querySelector('[info]');
const grantcont=document.querySelector('#grant');
const form=document.querySelector('[form]');
const input=document.querySelector('#input');
const emsg=document.querySelector('[emsg]');
const eimg=document.querySelector('[eimg]');
const ebtn=document.querySelector('[ebtn]');
const err=document.querySelector('[err]');
getsession();
let tab=user;
search.addEventListener('click',()=>{
    switchtab(search);
});
user.addEventListener('click',()=>{
    switchtab(user);
});
function switchtab(newtab){
    err.classList.remove('flex');
    err.classList.add('hidden');
    if(tab!=newtab){
        tab.classList.remove('bg-[#dbe2ef82]');
        tab=newtab;
        tab.classList.add('bg-[#dbe2ef82]');
    }
    if(newtab==search&&form.classList.contains('hidden')){
        form.classList.remove('hidden');
        form.classList.add('flex');
        info.classList.remove('flex');
        info.classList.add('hidden');
        grantcont.classList.remove('flex');
        grantcont.classList.add('hidden');
    }
    else{
        form.classList.add('hidden');
        form.classList.remove('flex');
        getsession();
    }
}



grant.addEventListener('click',getlocation);
function getlocation(){
    if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(show);
    else
    grant.classList.add('hidden');
}
function show(pos){
    let loc={
        lat:pos.coords.latitude,
        lon:pos.coords.longitude
    };
    sessionStorage.setItem('userloc',JSON.stringify(loc));
    fetchloc(loc);
}

async function fetchloc(loc){
    grantcont.classList.remove('flex');
    grantcont.classList.add('hidden');
    load.classList.remove('hidden');
    load.classList.add('flex');
    const{lat,lon}=loc;
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`);
        let result= await response.json();
        if(!result.sys)
        throw result;
        load.classList.remove('flex');
        load.classList.add('hidden');
        info.classList.remove('hidden');
        info.classList.add('flex');
        render(result);
    }
    catch(e){
        eimg.classList.remove('block');
        eimg.classList.add('hidden');
        load.classList.remove('flex');
        load.classList.add('hidden');
        err.classList.remove('hidden');
        err.classList.add('flex');
        ebtn.classList.remove('hidden');
        ebtn.classList.add('block');
        emsg.innerText=`Error : ${e?.message}`;
        ebtn.addEventListener('click',fetchloc);
    }
}
function render(data){
    const city=document.querySelector('[city]');
    const country=document.querySelector('[country]');
    const desc=document.querySelector('[desc]');
    const icon=document.querySelector('[icon]');
    const temp=document.querySelector('[temp]');
    const wind=document.querySelector('[wind]');
    const humid=document.querySelector('[humid]');
    const cloud=document.querySelector('[cloud]');
    city.innerText=data?.name;
    country.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText=data?.weather?.[0]?.description;
    icon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${(data?.main?.temp-273.15).toFixed(2)} °C`;
    wind.innerText=`${data?.wind?.speed.toFixed(2)} M/S`;
    humid.innerText=`${data?.main?.humidity.toFixed(2)} %`;
    cloud.innerText=`${data?.clouds?.all.toFixed(2)} %`;
}

function getsession(){
    let coor=sessionStorage.getItem('userloc');
    if(!coor)
    {
        grantcont.classList.remove('hidden');
        grantcont.classList.add('flex');
    } 
    else
    {
        coor=JSON.parse(coor);
        fetchloc(coor);
    }  
}



form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(input.value==="")
    return;
    fetchcity(input.value);
    console.log(input.value);
    input.value="";
})
async function fetchcity(city){
    info.classList.remove('flex');
    info.classList.add('hidden');
    err.classList.remove('flex');
    err.classList.add('hidden');
    load.classList.remove('hidden');
    load.classList.add('flex');
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        let result= await response.json();
        if(!result.sys)
        throw result;
        load.classList.remove('flex');
        load.classList.add('hidden');
        info.classList.remove('hidden');
        info.classList.add('flex');
        render(result);
    }
    catch(e){
        load.classList.remove('flex');
        load.classList.add('hidden');
        err.classList.remove('hidden');
        err.classList.add('flex');
        eimg.classList.remove('hidden');
        eimg.classList.add('block');
        emsg.innerText=`Error : ${e?.message}`;
    }
}