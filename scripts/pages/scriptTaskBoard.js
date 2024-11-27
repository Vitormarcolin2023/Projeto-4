import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");
const boardsList = document.getElementById("listarItem");

/*Apresentar o nome do Usuario */
function recuperarNomeUser() {
  let userName = document.getElementById("nomeUsuario");

  if (recuperarUser) {
    userName.innerText = `Olá, ${recuperarUser.nome.split(" ")[0]}`;
  } else {
    userName.innerText = "Olá";
  }
}

recuperarNomeUser();

/*DropDown*/

async function carregarBoars() {
  try {
    const resposta = await fetch(
      "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar boards");
    }
    const boards = await resposta.json();
    boardsDropdowns(boards);
  } catch (erro) {
    console.log("Erro ao carregar boards:", erro);
  }
}

function boardsDropdowns(boards) {
  boardsList.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

  boards.forEach((board) => {
    const listarItem = document.createElement("li");
    listarItem.innerHTML = `
      <a class="dropdown-item" id="dropdpwn-item" value="${board.id}">
        ${board.Name}
      </a>`;

    listarItem.addEventListener("click", (event) => {
      loadBoards(board.id); // Certifique-se de que loadBoards esteja definida
      document.querySelector(".dropbtn").textContent = board.name;
      myFunction(); // Fecha o dropdown
    });

    boardsList.appendChild(listarItem); // Adiciona o li à ul
  });
}

carregarBoars();

/*Modo Dark*/
const columns = document.querySelectorAll(".column");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

let darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("change", () => {
  darkMode = localStorage.getItem("darkMode");

  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

function enableDarkMode() {
  body.classList.add("dark-mode");
  localStorage.setItem("darkMode", "enabled");
  darkModeToggle.checked = true;
}

function disableDarkMode() {
  body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", "disabled");
  darkModeToggle.checked = false;
}

document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.add("dragging");
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.remove("dragging");
  }
});


/*Outra função */

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const itemsContainer = column.querySelector(".items-container");
    const applyAfter = getNewPosition(itemsContainer, e.clientY);

    if (dragging && itemsContainer) {
      // Verifica se ambos os elementos existem
      if (applyAfter) {
        itemsContainer.insertBefore(dragging, applyAfter.nextElementSibling);
      } else {
        itemsContainer.prepend(dragging);
      }
    }
  });
});

function getNewPosition(itemsContainer, posY) {
  const cards = itemsContainer.querySelectorAll(".item:not(.dragging)");
  let result = null; // Inicializa como null

  for (let refer_card of cards) {
    const box = refer_card.getBoundingClientRect();
    const boxCenterY = box.y + box.height / 2;

    if (posY >= boxCenterY) {
      result = refer_card;
    }
  }
  return result;
}
