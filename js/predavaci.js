const getData = async function () {
	let response = await fetch("data/predavaci.json");
	let data = await response.json();
	addPredavaci(data);
}

const addPredavaci = async function (data) {
	let predavaci = data.predavaci;
	let gallery = document.querySelector('.gallery');
	let predavaciTemp = document.querySelector('#predavaci-template');
    

	for (let index = 0; index < predavaci.length; index++) {
		let predavac = predavaciTemp.content.cloneNode(true);
		
        let predavacImage = predavac.querySelector('.predavaci-img');
		predavacImage.src = predavaci[index].imageUrl;

        let predavacName = predavac.querySelector('#predavaci-name');
		predavacName.textContent = predavaci[index].name;

        let predavacTema = predavac.querySelector('#predavaci-tema');
		predavacTema.textContent = predavaci[index].tema;

        let predavacTermin = predavac.querySelector('#predavaci-termin');
		predavacTermin.textContent = predavaci[index].termin;

        gallery.appendChild(predavac);
	}
};
getData();