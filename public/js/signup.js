form=document.forms["signup"];
//prendo il form , accedendo a tutti i form della pagina secondo la notazione sopra riportata , poi nelle parentesi metto il nome del form
// che è nell'attributo name del form stesso

form.addEventListener("submit",convalidazione);
//adesso assegno al form l'evento submit che si "sincronizza"  alla pressione del tasto registra che è un input di tipo submit
// ad evento compiuto , viene eseguita la funzione passata come parametro , in questo caso convalidazione

form.username.addEventListener("submit",controllaUtente);
// . username , accede all'input di nome username ,  a cui associo l'evento controllaUtente
//questo serve per controllare se l'utente è gia registrato , in caso positivo , il box si colora di rosso , per dire utente gia presente , lo username deve essere univoco nel database

function convalidazione(event){  // event è l'evento stesso

    var controllo=0; // var di comodo , vedere sotto
    form = event.currentTarget; // qui prendo il form che è il titolare dell'evento , cioè è associato a lui (con currentTarget)

    //ora controllo che tutti i campi nel javascript siano pieni
    if(!form.name.value || !form.surname.value || !form.email.value || !form.password.value || !form.username.value || !form.password_confirmation.value || !form.birth.value){
        alert("riempi  tutti i campi !");
        controllo=1;
    }

    //che le due password coincidano
    if(form.password.value!=form.password_confirmation.value){
        alert("Le password non coincidono!");
        controllo=1;
    }

    //che la mail contenda la chiocciola
    if(form.email.value.search("@")==-1){
        alert("Formato mail non valido!");
    }

    // infine uso questa varibile di comodo per interrompere l'esecuzione del post se almeno uno deli if precedento non è verificato
    if(controllo==1)event.preventDefault();
}

function controllaUtente(event){
    var token = document.querySelector("meta[name='csrf-token']").getAttribute("content");/*
    evita un tipo di attacco chiamato cross-site(è possibile che arrivi una richiesta di un sito dove siamo autenticati,
    che si spaccia per noi)*/
    FormData.append('_token', token); //per appendere il token
    const inserito = event.currentTarget.value;
    const formData = new FormData();
    formData.append('send', inserito);
    formData.append('_token', token);
    
    fetch(event.currentTarget.getAttribute("verifyUsername"), {method: 'POST', body: formData, headers: {"X-CSRF-TOKEN": token}}).then(response);
    // col primo . then mi viene tornata una promessa , da cui mi faccio ritornare un altra promessa
    // ma quello inprtante è l'utimo then che riceve in ultimo testo madato dal server , sappiamo che quello che torna è una stringa
    // perhcè nel primo then  , lo abbiamo indicato nella funzione passate come parametro , cioe response , che trona prorpio reponse.text();
    // a indicare che quello che riceviamo nel secondo then è un testo
    // quindi riassumendo , l'ultimo then aspetta in maniera "disinteressata" , asincrona , la risposta del server .
}

function response(response){ //la funzione passata al primo then
    return response.text(); // diciamo che ci aspettiamo un testo  nel secondo then dal server
}

