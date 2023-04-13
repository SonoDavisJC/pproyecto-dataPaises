const CardCountrie = (pais) => {
    let $itemCountrie = document.createElement("div");
    $itemCountrie.className = 'countries__item';
    let html = `<div>
            <figure>
                <img src="${pais.flag}" class="img-countrie"></img>
            </figure>
            <div class="countries__information">
                <h3 class="countries__item--name">${pais.name}</h3>
                <p class="countries__item--cap"><span>Capital : </span><span class="countries__item--capital">${pais.capital}</span></p>
                <p class="countries__item--lan"><span>Languajes : </span><span class="countries__item--languajes">${pais.languages.join(", ")}<span></p>
                <p class="countries__item--popu"><span class="">Población : </span> <span class="countries__item--population">${pais.population}</span></p>
            </div>
            </div>`;    
    $itemCountrie.innerHTML = html;
    return $itemCountrie;
}
export default CardCountrie;