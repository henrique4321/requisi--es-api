async function buscarClima(){

  const cidade = document.getElementById("cidade").value;

  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "Carregando...";

  try{

    // 1️⃣ Buscar latitude e longitude da cidade
    const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`;

    const geoResposta = await fetch(geoUrl);
    const geoDados = await geoResposta.json();

    if(!geoDados.results){
      resultado.innerHTML = "Cidade não encontrada";
      return;
    }

    const latitude = geoDados.results[0].latitude;
    const longitude = geoDados.results[0].longitude;
    const nomeCidade = geoDados.results[0].name;
    const pais = geoDados.results[0].country;

    // 2️⃣ Buscar clima
    const climaUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const climaResposta = await fetch(climaUrl);
    const climaDados = await climaResposta.json();

    const temp = climaDados.current_weather.temperature;
    const vento = climaDados.current_weather.windspeed;

    resultado.innerHTML = `
      <h2>${nomeCidade}, ${pais}</h2>
      <p>🌡️ Temperatura: ${temp} °C</p>
      <p>💨 Vento: ${vento} km/h</p>
    `;

  }
  catch(erro){
    resultado.innerHTML = "Erro ao buscar dados";
    console.log(erro);
  }

}
