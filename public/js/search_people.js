function onJson(json){
    console.log(json);
    const grid= document.querySelector('.grid'); //Seleziona il div vuoto di classe .grid
    grid.innerHTML='';

    for(utente of json){ //processiamo i risultati

        const username= document.createElement("div"); //crea la costante username
        username.textContent=utente.username; //inserisce l'username dell'utente

        const img= document.createElement('img');
        img.src=utente.photo;

        const br= document.createElement('br'); //è lo spazio..tipo /n del #C

        const follow= document.createElement("button"); //creo i bottoni, dove inserisco l'ID, cioè associa a follow l'ID dell'utente
        follow.setAttribute('data-id',utente.id); //Associ l'ID dell'utente al bottone
        follow.setAttribute('id',"follow"); //ID della persona
        follow.innerHTML = 'Follow';



        const unfollow=document.createElement('button');
        unfollow.setAttribute('data-id',utente.id);
        unfollow.innerHTML='Unfollow';



        follow.addEventListener('click',followPeople); //Ai bottoni follow e unfollow aggiunge l'evento click, dove richiama effettivamente follow people e unfollow people
        unfollow.addEventListener('click',unfollowPeople);



        const result = document.createElement("div"); //si crea una const result
        result.classList.add("result");  //Aggiunge la classe result
        grid.appendChild(result);
        result.appendChild(username); //si appendono username, immagine...
        result.appendChild(img);
        result.appendChild(br);
        result.appendChild(follow);
        result.appendChild(unfollow);



    }
}



function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}

function searchPeople(event){
    event.preventDefault();
    var token = document.querySelector("meta[name='csrf-token']").getAttribute("content"); /*
    evita un tipo di attacco chiamato cross-site(è possibile che arrivi una richiesta di un sito dove siamo autenticati,
    che si spaccia per noi)*/
    const formdata = new FormData();
    formdata.append('search_people', document.querySelector('#searchtext')/*Id dell'input text*/.value);
    formdata.append('_token', token);

    fetch(form.getAttribute('action'), {method: 'POST', body:formdata}).then(onResponse).then(onJson);

}


function onText(text){
    console.log(text);
    if(parseInt(text)==1)
    alert("utente gia seguito");
    if(parseInt(text)==0){
    alert("non segui piu");
    }





}
function responseFollow(response){
    console.log("Risposta follow ricevuta");
    return response.text();
}



function followPeople(event){  
   var token = document.querySelector("meta[name='csrf-token']").getAttribute("content"); //Follow è di tipo POST, quindi impostiamo il token per evitare errori di tipo csrf
   const followed= event.currentTarget.dataset.id; //creo la costante followed dove va a prender l'evento corrente che è associato al bottone
   console.log(followed);
   event.currentTarget.removeEventListener('click',followPeople); /*Rimuove l'evento follow, e aggiunge quello unfollow*/
   {
    alert("Utente seguito");
    }
   event.currentTarget.addEventListener('click',unfollowPeople);
   
   const formdata = new FormData();
   formdata.append("followed",followed); 
   formdata.append('_token',token);
   fetch(FOLLOW,{method:"post", body:formdata}).then(responseFollow);//Chiama la fetch dove c'è l'attributo follow(costante che richiama la route follow), poi resituisce una response.
}

function unfollowPeople(event){
    const unfollow = event.currentTarget.dataset.id;
    event.currentTarget.removeEventListener('click',unfollowPeople);
    {
        alert("Utente unfollowato");
        }
        
   event.currentTarget.addEventListener('click',followPeople);
    fetch(UNFOLLOW+'?unfollow='+unfollow).then(responseFollow); //sintassi del GET
 }




const form = document.forms['search-form']; //lo trovi su search_blade.php
form.addEventListener('submit',searchPeople);
