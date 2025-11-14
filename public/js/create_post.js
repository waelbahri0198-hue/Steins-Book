function onText(text){
    console.log(text);
    if(text==="true"){
        alert("Post condiviso");
    }
}

function onResponse2(response){
    return response.text();
}

function share(event, form_share){//passandogli il form share passa da create_form a share
    var token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const form_data = {method: 'post', body: new FormData(form_share), headers: {"X-CSRF-TOKEN": token}};
    const newLocal = 'route_do_create_post';
   
    fetch(document.getElementById(newLocal).value, form_data).then(onResponse2).then(onText);
    event.preventDefault();
    console.log("URL fetch:", document.getElementById(newLocal).value);
console.log("Method:", 'POST');

}

function onModalClick() {
    document.body.classList.remove('no-scroll');
    modalView.classList.add('hidden');
    modalView.innerHTML = '';
  }

function createForm(){
    const form_share = document.createElement('form'); //crea il form
    form_share.setAttribute('method', "post"); //ti setta il form_share a post
    form_share.setAttribute('name', "form_share");//gli setti il nome(form_share)
    const submit = document.createElement("input");
    submit.setAttribute('type', "submit");
    submit.setAttribute('value', "Condividi");//crea il tasto condividi
    const field = document.createElement("input");
    field.setAttribute('type', "text"); //aggiunge il tipo test
    field.setAttribute('name', "campo2"); //gli setta il campo2
    const button = document.createElement("button");
    button.setAttribute('type', "button");
    button.textContent="Chiudi"; //ti crea il bottone chiudi
    button.addEventListener('click', onModalClick);
    const nascosto = document.createElement("input"); //si crea un elemento di tipo input
    nascosto.setAttribute('type', "hidden"); //aggiunge il tipo hidden
    nascosto.setAttribute('name', "nascosto"); //gli setta nascosto
    const nascosto2 = document.createElement("input");
    nascosto2.setAttribute('type', "hidden");
    nascosto2.setAttribute('name', "nascosto2");
    form_share.appendChild(submit);
    form_share.appendChild(field);
    form_share.appendChild(button);
    form_share.appendChild(nascosto);
    form_share.appendChild(nascosto2);
    return form_share;
}

function createImage(src) {
    const image = document.createElement('img');
    image.src = src;
    return image;
  }

function onThumbnailClick(event){
    const scheda = event.currentTarget; //PRENDE L'EVENTO A CUI E' ASSOCIATO 
    console.log(scheda);
    const img2 = scheda.querySelector('.copertina'); //richiamo "copertina" che è quello creato di sotto (riga 96)
    console.log(img2.src);

    const image = createImage(img2.src);
    const form_share = createForm();
    console.log(form_share);
    document.body.classList.add('no-scroll'); //Evita lo scroll quando c'è la modale
    modalView.style.top = window.pageYOffset + 'px'; //Te lo mette tutto verticale
    modalView.appendChild(image);
    modalView.appendChild(form_share);
    modalView.classList.remove('hidden'); //rimuove l'hidden quando si entra in questa funzione
    form_share.nascosto.value=img2.src; //(nascosto sarebbe l'immagine)-->va a prendere l'immagine
    form_share.nascosto2.value="i";//va a prendere il tipo
    console.log(form_share.nascosto);

    let doClick = (event) => share(event, form_share);
    form_share.addEventListener('submit', doClick);
}

function onJSON(json){
    console.log(json);
    if(form.api.value==="opzione1"){//se il form dove la select di tipo API va a prendere l'opzione 1:
                let container=document.querySelector("#risultati"); //crea il contenitore dove seleziona questo selettore che è un div vuoto con id risultati
                container.innerHTML=""; //lo svuota

                    for(let tmp of json.results){//processa i risultati
                        let div=document.createElement('div'); //creo il div(tutto il contenitore del post)
                        div.classList.add('raccolta'); //aggiungo la classe raccolta
                        div.setAttribute('id', tmp.id); //Assegna l'id del post
                        container.appendChild(div); //Aggiungi al container questo div

                        let img=document.createElement('img'); //Aggiunge l'immagine
                        img.classList.add('copertina');
                        img.src=tmp.image.small_url; //c'era "small"
                        div.appendChild(img);

                        let div1=document.createElement('div'); //Aggiunge il nome
                        div1.textContent=tmp.volume.name; 
                        div.appendChild(div1);

                        let div2=document.createElement('div'); //Aggiunge l'id del fumetto
                        div2.textContent=tmp.id;
                        div.appendChild(div2);

                       
                        div.addEventListener('click', onThumbnailClick); //Aggiunge l'evento OnThumbnailClick(modale)
                    }
                 }else if (form.api.value === "opzione2") {
    console.log('JSON ricevuto2');

    let library = document.querySelector('#risultati');
    library.innerHTML = '';

    let docs = json.docs || [];
    let max = Math.min(docs.length, 10);

    for (let i = 0; i < max; i++) {
        const doc = docs[i];
        console.log("Doc ricevuto:", doc);

        const title = doc.title || "Titolo sconosciuto";

        // Costruzione URL copertina
        let cover_url = '/img/default-cover.jpg'; // fallback locale
        if (doc.cover_i) {
            cover_url = "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-M.jpg";
        } else if (doc.cover_edition_key) {
            cover_url = "https://covers.openlibrary.org/b/olid/" + doc.cover_edition_key + "-M.jpg";
        }

        const book = document.createElement('div');
        book.classList.add('book');

        const img = document.createElement('img');
        img.classList.add('copertina');
        img.src = cover_url;

        // fallback immagine se URL non esiste
        img.onerror = () => {
            img.src = '/img/default-cover.jpg';
        };

        const caption = document.createElement('span');
        caption.textContent = title;

        book.appendChild(img);
        book.appendChild(caption);
        library.appendChild(book);

        book.addEventListener('click', onThumbnailClick);
    }

    console.log("Fine elaborazione libri", json);
}


                /*else if(form.api.value==="opzione2"){
                        console.log('JSON ricevuto2');
                        // Svuotiamo la libreria
                        let library = document.querySelector('#risultati');
                        library.innerHTML = '';
                        // Leggi il numero di risultati
                        let num_results = json.num_found;
                        // Mostriamone al massimo 10
                        if(num_results > 10)
                          num_results = 10;
                        // Processa ciascun risultato
                        for(let i=0; i<num_results; i++)
                        {
                          // Leggi il documento
                          const doc = json.docs[i]
                          // Leggiamo info
                          const title = doc.title;
                          const isbn = doc.isbn[0];
                          // Costruiamo l'URL della copertina
                          const cover_url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
                          // Creiamo il div che conterrà immagine e didascalia
                          const book = document.createElement('div');
                          book.classList.add('book');
                          // Creiamo l'immagine
                          let img=document.createElement('img');
                          img.classList.add('copertina');
                          img.src=cover_url;
                          book.appendChild(img);
                          // Creiamo la didascalia
                          const caption = document.createElement('span');
                          caption.textContent = title;
                          // Aggiungiamo immagine e didascalia al div 
                          book.appendChild(img);
                          book.appendChild(caption);
                          // Aggiungiamo il div alla libreria AL RIGO 132
                          library.appendChild(book);
                          book.addEventListener('click', onThumbnailClick);
                        }
                        console.log(json);

                    }*/
}

function onResponse(response){
    return response.json();
}

function search(eventi){
        eventi.preventDefault();
    var token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const form_data = {method: 'POST', body: new FormData(form), headers: {"X-CSRF-TOKEN": token}};
     console.log(document.getElementById('route_do_search_content').value);
    fetch(document.getElementById('route_do_search_content').value, form_data).then(onResponse).then(onJSON); //Fa la fetch che prende come ID do_search_content(su create_Post.blade)

    

}


const form = document.forms['form_search']; //chiama il form di tipo form search
// Aggiungi listener
form.addEventListener('submit', search); //aggiunge l'evento submit e richiama la funzione search
const modalView = document.querySelector('#modal-view');
