


/* BUSCAR FILME */


function buscarFilme() {

    const nomeFilme = document.getElementById("nomeFilme").value.trim();
    const resultado = document.getElementById("resultado");

    if(nomeFilme === ""){

        resultado.innerHTML = `
            <div class="filme-nao-encontrado">
                <h3>⚠ Digite o nome de um filme</h3>
            </div>
        `;
        return;
    }

    resultado.innerHTML = "<p>Carregando...</p>";

    fetch(`${urlBusca}?api_key=${apiKey}&language=pt-BR&query=${nomeFilme}`)

    .then(resposta => resposta.json())

    .then(dados => {

        if(!dados.results || dados.results.length === 0){

            resultado.innerHTML = `
                <div class="filme-nao-encontrado">
                    <h3>❌ Filme não encontrado</h3>
                    <p>Tente outro nome.</p>
                `;
            return;
        }

        mostrarFilmes(dados.results, "resultado");

    })

    .catch(erro => {

        console.error(erro);

        resultado.innerHTML = `
            <div class="filme-nao-encontrado">
                <h3>⚠ Erro ao buscar filme</h3>
                <p>Tente novamente.</p>
            </div>
        `;

    });

}


/* ============================= */
/* CARREGAR RECOMENDADOS */
/* ============================= */

function carregarRecomendados(){

    fetch(`${urlPopular}?api_key=${apiKey}&language=pt-BR`)

    .then(resposta => resposta.json())

    .then(dados => {

        mostrarFilmes(dados.results, "recomendados");

    })

    .catch(erro => {

        console.error("Erro ao carregar recomendados:", erro);

    });

}


/* ============================= */
/* MOSTRAR FILMES */
/* ============================= */

function mostrarFilmes(filmes, elementoId){

    const container = document.getElementById(elementoId);

    container.innerHTML = "";

    filmes.slice(0,10).forEach(filme => {

        const poster = filme.poster_path
            ? urlImagem + filme.poster_path
            : "sem-imagem.png";

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


/* ============================= */
/* ABRIR DETALHES */
/* ============================= */

function abrirDetalhes(id){

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`)

    .then(resposta => resposta.json())

    .then(filme => {

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=pt-BR`)

        .then(resposta => resposta.json())

        .then(videos => {

            let trailer = "";

            const trailerOficial = videos.results.find(video =>
                video.type === "Trailer" &&
                video.site === "YouTube"
            );

            if(trailerOficial){

                trailer = `
                    <a href="https://www.youtube.com/watch?v=${trailerOficial.key}"
                    target="_blank"
                    class="btn-trailer">
                    ▶ Assistir Trailer
                    </a>
                `;

            }else{

                trailer = `<p>Trailer não disponível.</p>`;

            }

            const poster = filme.poster_path
                ? urlImagem + filme.poster_path
                : "sem-imagem.png";

            document.getElementById("modal-body").innerHTML = `

                <img src="${poster}">
                <h2>${filme.title}</h2>
                <p><b>Avaliação:</b> ⭐ ${filme.vote_average.toFixed(1)}</p>
                <p><b>Data de lançamento:</b> ${filme.release_date}</p>
                <p>${filme.overview}</p>
                ${trailer}

            `;

            document.getElementById("modal").style.display = "block";

        })

        .catch(erro => console.error("Erro ao buscar trailer:", erro));

    })

    .catch(erro => console.error("Erro ao buscar detalhes:", erro));

}


/* ============================= */
/* FECHAR MODAL */
/* ============================= */

function fecharModal(){

    document.getElementById("modal").style.display = "none";

}


/* ============================= */
/* FECHAR AO CLICAR FORA */
/* ============================= */

window.onclick = function(event){

    const modal = document.getElementById("modal");

    if(event.target === modal){

        modal.style.display = "none";

    }

}


/* ============================= */
/* CARREGAR AUTOMATICAMENTE */
/* ============================= */

carregarRecomendados();