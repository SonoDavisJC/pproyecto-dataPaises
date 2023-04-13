import CardCountrie from "./components/CardCountrie.js";

const $NumCountries = document.querySelector(".header__information--number");
const $CountCountries = document.querySelector(".header__information--count");
const $TextInput = document.getElementById("myInput");
const $resultadoBusqueda = document.getElementById('resultado-busqueda');
const $paisesLength = document.getElementById('paises-length')

// llamad a botones: 
const $btnName = document.getElementById("btnName");
const $btnCapital = document.getElementById("btnCapital");
const $btnPopulation = document.getElementById("btnPopulation");

// llamada botones grafico
const $btnGraficoPoblacion = document.getElementById("btnPoblacion");
const $btnGraficoLenguas = document.getElementById("btnLenguages");


// 
const $graficoBody = document.querySelector('.containerBody');

const $countries = document.getElementById("sectionCountries");
//const $sectionEstadistica = document.getElementById("Statistics");
let $fragmet = document.createDocumentFragment();


const ctx = document.getElementById('myChart');


const DataCountries = [];



async function GetCountries() {
    try {
        const data = await axios.get('./assets/data.json');
        const json = await data.data;

        $paisesLength.textContent = json.length;

        json.forEach(element => {
            DataCountries.push(element);
            //let $itemCountrie = document.createElement("div");
            //$itemCountrie.className = 'countries__item'
            //$itemCountrie.innerHTML = CardCountrie(element);
            $fragmet.appendChild(CardCountrie(element));
        })
        $countries.appendChild($fragmet);


        // Grafico inicial 
        GetGraficoPorPoblacion(json);

        // botones inicialmente
        $btnGraficoPoblacion.addEventListener("click", (c) => GetGraficoPorPoblacion(json) );
        $btnGraficoLenguas.addEventListener("click", (c) => GetGraficoPorLenguas(json));
        $btnName.addEventListener("click", (e) => getOrdenPorNombrePais(json));
        $btnPopulation.addEventListener("click", (e) => getOrdenPorPoblacionPais(json));
        $btnCapital.addEventListener("click", (e) => getOrdenPorCapitalPais(json));

        
        $TextInput.addEventListener("input", (e) => { 
            $countries.innerHTML = "";

            

            const filtroPaises = json.filter((a) => {
                let parameter = e.target.value;
                let text = parameter.slice(0,1).toUpperCase() + parameter.slice(1).toLowerCase();
                return a.name.includes(parameter) || a.name.includes(text) ;
            })

            $resultadoBusqueda.textContent = filtroPaises.length;

            filtroPaises.forEach(element => {
                DataCountries.push(element);
                $fragmet.appendChild(CardCountrie(element));
   
            });
            $countries.appendChild($fragmet);


            $btnName.addEventListener("click", (e) => getOrdenPorNombrePais(filtroPaises));
            $btnPopulation.addEventListener("click", (e) => getOrdenPorPoblacionPais(filtroPaises));
            $btnCapital.addEventListener("click", (e) => getOrdenPorCapitalPais(filtroPaises));

            // botones posteriormente, pero se aplica una condicion.
            // if :
            if(filtroPaises.length == json.length - 1) {
                GetGraficoPorPoblacion(json);
                $btnGraficoPoblacion.addEventListener("click", (c) => GetGraficoPorPoblacion(json));
                $btnGraficoLenguas.addEventListener("click", (c) => GetGraficoPorLenguas(json));
                return;
            }
            // else :
            GetGraficoPorPoblacion(filtroPaises, 'despues');
            $btnGraficoPoblacion.addEventListener("click", (c) => GetGraficoPorPoblacion(filtroPaises, 'despues'));
            $btnGraficoLenguas.addEventListener("click", (c) => GetGraficoPorLenguas(filtroPaises, 'despues'));  

        });

    } catch (error) {
        let message = error.message || 'Ocurrio un error';
        let status = error.response.status;
        $countries.innerHTML = `<h3>Ups ${status}, ${message}</h3>`
    }
}

document.addEventListener("DOMContentLoaded", GetCountries());


// Realizar la grafica con Chart.js

let chart;
function dataGrafico (arrNames, arrNums, label) {

    
    const totalLabels = arrNames.length;

    const data = {
        labels: arrNames,
        datasets: [{
          label: label,
          data: arrNums,
          borderWidth: 1
        }],
        responsive:true,
    };

    const options = {
        maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data,
        options,
    });


    if(totalLabels > 10) {
        const newWidth = 700 + ((totalLabels - 7) * 30)
        $graficoBody.style.width = `${newWidth}px`;
    }

}



/**
 * 
 * Datos para grafica
 *  
*/


// Nombre de momento en String (inicio o despues) en camelCase
function realizarGraficaPoblacion (arr, momento) {
    const ArrPoblacion = [];
    for(let p of arr) {
        ArrPoblacion.push({country: p.name, poblacion: p.population, longitudBarra: String(p.population).slice(0, -7)});
    }
    const OrdenPonblacion = ArrPoblacion.sort((a,b) => b.poblacion - a.poblacion);


    let cantidaPoblacionPaises = [];

    if(momento == 'inicio') {
        for (let i =0; i < 10; i++) {
            cantidaPoblacionPaises.push(OrdenPonblacion[i]);
        }
    }
    if(momento == 'despues') {
        for (let i =0; i < OrdenPonblacion.length; i++) {
            cantidaPoblacionPaises.push(OrdenPonblacion[i]);
        }
    }

     //------
     ctx.innerHTML = '';
     const arr_names = [];
     for(let names of cantidaPoblacionPaises) {
         arr_names.push(names.country);
     }
     const arr_poblacion = [];
     for(let pobla of cantidaPoblacionPaises) {
         arr_poblacion.push(pobla.poblacion);
     }
 


     if(chart) { chart.destroy(); }
     dataGrafico(arr_names, arr_poblacion, 'Nº de Habitantes');
 
     //------



}

// Nombre de momento en String (inicio o despues) en camelCase
function realizarGraficaIdiomas (arr, momento) {
    ctx.innerHTML = '';


    let ArrLenguas = [];
    for (const le of arr) {
      ArrLenguas.push(le.languages);
    }
    let LenguasUnicas = [...new Set(ArrLenguas.flat())];

    let ArrIdiomas = [];
    for(let idioma of LenguasUnicas) {
        let count = arr.filter((countLengua) => countLengua.languages.includes(idioma));
        ArrIdiomas.push({name: idioma, num: count.length, size: count.length });
    }

    let OrdenIdiomas = ArrIdiomas.sort((a,b) => b.num - a.num);


    const cantidadIdiomas = [];
    if(momento == 'inicio') {
        for(let i = 0; i < 10; i++) {
            cantidadIdiomas.push(OrdenIdiomas[i]);
        }
    }else {
        for(let i = 0; i < OrdenIdiomas.length; i++) {
            cantidadIdiomas.push(OrdenIdiomas[i]);
        }
    }

    const arr_name = [];
    const arr_cantIdiomas = []

    for(let name of cantidadIdiomas) {
        arr_name.push(name.name);
    }
    for(let cant of cantidadIdiomas) {
        arr_cantIdiomas.push(cant.num);
    }

    if(chart) { chart.destroy(); }
    dataGrafico(arr_name, arr_cantIdiomas, 'Cantidad de idioma');

}



/**
 * 
 * Llamada a graficos
 * 
 */

function GetGraficoPorPoblacion(arr, momento = 'inicio') {

    realizarGraficaPoblacion(arr, momento);

}

function GetGraficoPorLenguas(arr, momento = 'inicio') {

    realizarGraficaIdiomas(arr, momento);
    
}





/**
 * 
 * Botones de ordenar por :
 * 
 */


// --------- Ordenar por nombre del pais
function getOrdenPorNombrePais (arr) {

    $btnName.classList.toggle('active');

    $countries.innerHTML = '';
    if($btnName.className.includes('active')) {
        let ordenDescendente = arr.sort((a,b) => {
            if(a.name > b.name){ return -1; };
            if(a.name < b.name){ return 1; }; return 0;
        });
        ordenDescendente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        });
        $countries.appendChild($fragmet);
    }

    if(!$btnName.className.includes('active')) {
        let ordenAscedente = arr.sort((a,b) => {
            if(a.name > b.name){ return 1; };
            if(a.name < b.name){ return -1; }; return 0;
        });
        ordenAscedente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        });
        $countries.appendChild($fragmet);
    }
}


// --------- Ordenar por la poblacion del pais
function getOrdenPorPoblacionPais (arr) {

    $btnPopulation.classList.toggle('active');

    $countries.innerHTML = '';
    if($btnPopulation.className.includes('active')) {
        let ordenAscedente = arr.sort((a,b) => a.population - b.population);
        ordenAscedente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        })
        $countries.appendChild($fragmet);
    }
    
    if(!$btnPopulation.className.includes('active')) {
        let ordenDescendente = arr.sort((a,b) => b.population - a.population);
        ordenDescendente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        })
        $countries.appendChild($fragmet);
    }

}


// --------- Ordenar por la capital del pais
function getOrdenPorCapitalPais (arr) {
    $btnCapital.classList.toggle('active');

    $countries.innerHTML = '';

    if($btnCapital.className.includes('active')) {
        let ordenAscedente = arr.sort((a,b) => {
            if(a.capital > b.capital){ return 1; };
            if(a.capital < b.capital){ return -1; }; return 0;
        });
        ordenAscedente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        });
        $countries.appendChild($fragmet);
    }

    if(!$btnCapital.className.includes('active')) {
        let ordenDescendente = arr.sort((a,b) => {
            if(a.capital > b.capital){ return -1; };
            if(a.capital < b.capital){ return 1; }; return 0;
        });
        ordenDescendente.forEach(item => {
            $fragmet.appendChild(CardCountrie(item));
        });
        $countries.appendChild($fragmet);
    }
}