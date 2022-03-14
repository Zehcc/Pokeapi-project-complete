window.onload = () => {
    init();
}

const init = async () => {
   getAllMapped();
}

const getPokemon = async (id) => {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const resultjs = await result.json();
    return resultjs
}

const getAllPokemons = async () =>{
    const allPokemons = [];
    for (i=1; i<=151; i++) {
    const pokemon =  await getPokemon(i);
    allPokemons.push(pokemon)
    }
    return allPokemons;
}

const getAllMapped = async () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loadingDiv';
    loadingDiv.innerHTML = '<img class="loadingIMG" src="https://i.gifer.com/origin/6d/6d067d7dd323a4cbc792f280968cd641.gif" alt="loading">';
    const main = document.querySelector('main');
    main.appendChild(loadingDiv);
    const pokemons = await getAllPokemons ();
    const mappedPokemons = pokemons.map (pokemon => {
        return {
            name: pokemon.name.toUpperCase(),
            image: pokemon.sprites.other.dream_world.front_default,
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
            number: pokemon.order
        }
    })
    document.querySelector('.loadingDiv').remove();
    const allPokemonsDiv = document.createElement('div');
    const allPokemonsList = document.createElement('ul');
    allPokemonsList.className = 'pokemons';
    mappedPokemons.forEach(pokemon => {
    allPokemonsList.innerHTML += `<li class="pokemonCard"><img src="${pokemon.image}" alt="${pokemon.name}"><h2 class="pokemonName">${pokemon.name}</h2><p class="mappedCardP">Altura: ${pokemon.height}m</p><p class="mappedCardP">Peso: ${pokemon.weight}kg</p><p class="mappedCardP"># ${pokemon.number}</p></li>`
    });
    main.appendChild(allPokemonsDiv).appendChild(allPokemonsList);
}

const getFiltered = async () => {
    const pokemons = await getAllPokemons();
    const inputFilter = document.querySelector('#filterInput');
    const filteredPokemons = pokemons.filter(pokemon => ( pokemon.name.toUpperCase().includes(inputFilter.value.toUpperCase())));
    const pokemonsList = document.querySelector(".pokemons");
    if (pokemonsList !== null) {
        pokemonsList.remove();
    }
    let filteredList = document.querySelector(".filteredPokemons");
    if (filteredList !== null) {
        removeAllChilds(filteredList);
    }
    if (filteredPokemons.length == 0) {
        alert(`¡${inputFilter.value.toUpperCase()} no esta en la lista!`)
    } else {
        filteredPokemons.forEach(pokemon => {
            if (filteredList == null){
                const filteredPokemons = document.createElement('ul');
                filteredPokemons.className = "filteredPokemons";
                const main = document.querySelector('.pokedexMain');
                main.appendChild(filteredPokemons);
                filteredList = document.querySelector(".filteredPokemons");
            }
            if (document.querySelector(`.filteredCardText${pokemon.name}`) == null){
            filteredList.innerHTML += `<li class="filteredCard"><div class="filteredCardImg" ><img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}"></div><div class ="filteredUl"><ul class="filteredCardText${pokemon.name}"></ul></div></li>`
            const filteredText = document.querySelector(`.filteredCardText${pokemon.name}`);
            const mappedStats = pokemon.stats.map(stat =>{
                return {
                    statName: stat.stat.name,
                    statValue: stat.base_stat
                }
            })
            for (const stat of mappedStats) {
                filteredText.innerHTML += `<li>${stat.statName.toUpperCase()} =>   ${stat.statValue}</li>`
            }
            }   
        });
    }   
    inputFilter.value= '';
}

const removeAllChilds = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const resetFilter = () => {
    document.querySelector(".filteredPokemons").remove();
    getAllMapped();
}