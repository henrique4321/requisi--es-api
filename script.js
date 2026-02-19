const apiKey = "563d1fe636f7f9d8066fcc6a7d684725";

const container = document.getElementById("filmes");

const modal = document.getElementById("modal");

const detalhesDiv = document.getElementById("detalhes");


// carregar filmes ao iniciar
carregarPopulares();


// filmes populares
function carregarPopulares(){

    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`)
    .then(res => res.json())
    .then(data => mostrarFilmes(data.results));

}


// mostrar filmes
function mostrarFilmes(filmes){

    container.innerHTML = "";

    filmes.forEach(filme => {

        const poster = 
        "https://image.tmdb.org/t/p/w500" + filme.poster_path;

        container.innerHTML += `
            <div class="card" onclick="verDetalhes(${filme.id})">

                <img src="${poster}">

                <h3>${filme.title}</h3>

                <p>⭐ ${filme.vote_average}</p>

            </div>
        `;

    });

}


// pesquisar filmes
function pesquisar(){

    const nome = document.getElementById("pesquisa").value;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${nome}`)
    .then(res => res.json())
    .then(data => mostrarFilmes(data.results));

}


// ver detalhes
function verDetalhes(id){

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`)
    .then(res => res.json())
    .then(filme => {

        const poster = 
        "https://image.tmdb.org/t/p/w500" + filme.poster_path;

        detalhesDiv.innerHTML = `
            <h2>${filme.title}</h2>

            <img src="${poster}" width="200">

            <p><strong>Nota:</strong> ${filme.vote_average}</p>

            <p>${filme.overview}</p>

            <div id="trailer"></div>

            <div id="assistir"></div>
        `;

        modal.style.display = "block";

        carregarTrailer(id);

        carregarOndeAssistir(id);

    });

}


// carregar trailer
function carregarTrailer(id){

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=pt-BR`)
    .then(res => res.json())
    .then(data => {

        const trailerDiv = document.getElementById("trailer");

        if(data.results.length > 0){

            const trailer = data.results[0];

            trailerDiv.innerHTML = `
                <h3>🎥 Trailer:</h3>

                <a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">

                    ▶ Assistir Trailer

                </a>
            `;

        }else{

            trailerDiv.innerHTML = "Trailer não disponível";

        }

    });

}


// onde assistir
function carregarOndeAssistir(id){

    fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {

        const assistirDiv = document.getElementById("assistir");

        const br = data.results.BR;

        if(br && br.flatrate){

            assistirDiv.innerHTML = "<h3>📺 Onde assistir:</h3>";

            br.flatrate.forEach(servico => {

                assistirDiv.innerHTML += `
                    <p>${servico.provider_name}</p>
                `;

            });

        }else{

            assistirDiv.innerHTML += 
            "<p>Não disponível no Brasil</p>";

        }

    });

}


// fechar modal
function fecharModal(){

    modal.style.display = "none";

}
