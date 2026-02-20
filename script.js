const apiKey = "563d1fe636f7f9d8066fcc6a7d684725";

const urlBusca = "https://api.themoviedb.org/3/search/movie";

const urlPopular = "https://api.themoviedb.org/3/movie/popular";

const urlImagem = "https://image.tmdb.org/t/p/w500";



/* BUSCAR FILME */

async function buscarFilme() {

    const nomeFilme = document.getElementById("nomeFilme").value;

    if(nomeFilme.trim() === "") {
        alert("Digite um nome");
        return;
    }

    const resposta = await fetch(
        `${urlBusca}?api_key=${apiKey}&language=pt-BR&query=${nomeFilme}`
    );

    const dados = await resposta.json();

    document.getElementById("resultado").classList.add("ativo");

    mostrarFilmes(dados.results, "resultado");

}



/* RECOMENDADOS */

async function carregarRecomendados() {

    const resposta = await fetch(
        `${urlPopular}?api_key=${apiKey}&language=pt-BR`
    );

    const dados = await resposta.json();

    mostrarFilmes(dados.results, "recomendados");

}



/* MOSTRAR FILMES */

function mostrarFilmes(filmes, elementoId) {

    const container = document.getElementById(elementoId);

    container.innerHTML = "";

    filmes.slice(0,10).forEach(filme => {

        const poster = filme.poster_path
        ? urlImagem + filme.poster_path
        : "";

        const card = document.createElement("div");

        card.classList.add("card");

        card.onclick = () => abrirDetalhes(filme.id);

        card.innerHTML = `

            <img src="${poster}">
            <h3>${filme.title}</h3>

        `;

        container.appendChild(card);

    });

}



/* ABRIR DETALHES */

async function abrirDetalhes(id) {

    const resposta = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
    );

    const filme = await resposta.json();



    const respostaVideo = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=pt-BR`
    );

    const videos = await respostaVideo.json();

  let trailer = "";
let botaoTrailer = "";

const trailerOficial = videos.results.find(video => 
    video.type === "Trailer" &&
    video.site === "YouTube" &&
    video.official === true
);

if(trailerOficial){

    trailer = `
        <a href="https://www.youtube.com/watch?v=${trailerOficial.key}"
        target="_blank"
        class="btn-trailer">
        ▶ Assistir Trailer
        </a>
    `;

    botaoTrailer = `
        <a href="https://www.youtube.com/watch?v=${trailerOficial.key}"
           target="_blank"
           class="btn-trailer">
           Assistir no YouTube
        </a>
    `;

}else{

    trailer = `<p>Trailer não disponível para incorporação.</p>`;

}


    const poster = urlImagem + filme.poster_path;



    document.getElementById("modal-body").innerHTML = `

        <img src="${poster}">

        <h2>${filme.title}</h2>

        <p><b>Avaliação:</b> ⭐ ${filme.vote_average}</p>

        <p><b>Ano:</b> ${filme.release_date}</p>

        <p>${filme.overview}</p>

        ${trailer}

    `;



    document.getElementById("modal").style.display = "block";

}



/* FECHAR MODAL */

function fecharModal(){

    document.getElementById("modal").style.display = "none";

}



/* CARREGAR AUTOMATICO */

carregarRecomendados();