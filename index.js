const COHORT = "/2401-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api${COHORT}/events`;

const state = {
  parties: [],
  selected: null,
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

//function in which selected party declares selected = party & hash = a party id
function selected(party) {
  state.selected = party;
  location.hash = party.id;
}
//CHECK

//load recipe from hash
function loadSelectedFromHash() {
  const id = +location.hash.slice(1);
  state.selected = state.parties.find((party) => party.id === id);
}

//CHECK

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const parsedResponse = await response.json();
    state.parties = parsedResponse.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render parties from state
 */
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties RN</li>";
    return;
  }

  const $parties = state.parties.map((party) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <button>Delete</button>
      `;
    const deleteButton = $li.querySelector("button");
    deleteButton.addEventListener("click", () => {
      deleteParty(party.id);
    });
    $li.addEventListener("click", (_event) => {
      selected(party);
    });

    return $li;
  });
  partyList.replaceChildren(...$parties);
}

function renderSelected() {
  const $party = document.querySelector("#selected"); //Figure this out
  $party.innerHTML = `
        <h2>${state.selected.name}</h2>
        <p>${state.selected.description}</p>
        <p>${state.selected.date}</p>
        <p>${state.selected.location}</p>
        <button>Delete</button>
      `;
}

/**
 * Ask the API to create a new party on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const date = new Date(addPartyForm.date.value).toISOString();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date,
        location: addPartyForm.location.value,
      }),
    });

    render();
  } catch (error) {
    console.error(error);
  }
}

//create event to click delete button and remove party listing from the window

async function deleteParty(id) {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "DELETE",
    });

    render();
  } catch (error) {
    console.error(error);
  }
}

//==========SCRIPT+++++++++++

async function init() {
  await getParties();
  renderParties();

  loadSelectedFromHash();
  renderSelected();
}

window.addEventListener("load", init);
