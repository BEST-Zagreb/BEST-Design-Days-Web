const leftImageElement = document.querySelector(".left__img");
const leftNameElement = document.querySelector(".left__name");
const leftTitleElement = document.querySelector(".left__title");
const middleImageElement = document.querySelector(".middle__img");
const middleNameElement = document.querySelector(".middle__name");
const middleTitleElement = document.querySelector(".middle__title1");
const middleTitleElement2 = document.querySelector(".middle__title2");
const rightImageElement = document.querySelector(".right__img");
const rightNameElement = document.querySelector(".right__name");
const rightTitleElement = document.querySelector(".right__title");
const orgButtons = document.querySelectorAll(".org-button");
let count = 0;
let orgData;

const getData = async function () {
	let response = await fetch("data/organizacijskiTim.json");
	orgData = await response.json();
	swapOrg();
    setInterval(()=>{
        count++;
        swapOrg(); 
    }, 4400);
};
getData();

async function swapOrg(){
    leftImageElement.src = orgData[(count) % orgData.length].imgUrl;
    leftNameElement.textContent  = orgData[(count) % orgData.length].ime;
    leftTitleElement.textContent  = orgData[(count) % orgData.length].funkcija;

    middleImageElement.src = orgData[(count + 1) % orgData.length].imgUrl;
    middleNameElement.textContent  = orgData[(count + 1) % orgData.length].ime;
    middleTitleElement.textContent  = orgData[(count + 1) % orgData.length].funkcija;
    middleTitleElement2.textContent = orgData[(count + 1) % orgData.length].funkcija2;
    
    rightImageElement.src = orgData[(count + 2) % orgData.length].imgUrl;
    rightNameElement.textContent  = orgData[(count + 2) % orgData.length].ime;
    rightTitleElement.textContent  = orgData[(count + 2) % orgData.length].funkcija;

    for(let i = 0; i < 4; i ++){
        orgButtons[(i) % orgData.length].style.background = "rgba(92,176,229,1)";
    }
    orgButtons[(count + 1) % orgData.length].style.background = "var(--pink-clr)";
}

async function clickOrg(cnt){
    count = cnt + 2;
    swapOrg();
}
