// Selecionando elementos do HTML
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const modalName = document.querySelector('.modal_name');
const modalId = document.querySelector('.modal_id');
const modalTypes = document.querySelector('.modal_types');
const modalHeight = document.querySelector('.modal_height');
const modalWeight = document.querySelector('.modal_weight');
const modalImage = document.querySelector('.modal__image');
const modal = document.getElementById('Modal');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const modalClose = document.querySelector('.close');
const buttonInfo = document.getElementById('button_info');

let searchPokemon = 1; // Número do Pokémon atualmente exibido

// Função para buscar dados de um Pokémon na API
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

// Função para renderizar informações básicas de um Pokémon na página principal
const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

// Função para atualizar o modal com informações detalhadas de um Pokémon
const updateModal = async (pokemon) => {
  const data = await fetchPokemon(pokemon);
  modalName.innerHTML = data.name;
  modalId.innerHTML = `ID: ${data.id}`;
  modalTypes.innerHTML = `Types: ${data.types.map(type => type.type.name).join(', ')}`;
  modalHeight.innerHTML = `Height: ${data.height / 10} m`;
  modalWeight.innerHTML = `Weight: ${data.weight / 10} kg`;
  modalImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
}

// Event listener para o formulário de busca de Pokémon
form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

// Event listener para o botão de Pokémon anterior
buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

// Event listener para o botão de Pokémon próximo
buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

// Event listener para o botão de informações do Pokémon (abrir modal)
buttonInfo.addEventListener('click', () => {
  modal.style.display = 'block';
  updateModal(searchPokemon);
});

// Event listener para fechar o modal ao clicar no botão de fechar
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Event listener para fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Renderiza o primeiro Pokémon ao carregar a página
renderPokemon(searchPokemon);
