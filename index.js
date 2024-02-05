const COHORT = "/2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();
//CHECK

/**
 * Update state with artists from API
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

//CHECK

/**
 * Render artists from state
 */
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Artists</li>";
    return;
  }

  const $parties = state.parties.map((party) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>
        <button id="delete">Delete</button>
      `;
    return $li;
  });

  partyList.replaceChildren(...$parties);
}
//CHECK
//Must create event to click delete button and remove party listing from the window

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

//NOT WORKING
