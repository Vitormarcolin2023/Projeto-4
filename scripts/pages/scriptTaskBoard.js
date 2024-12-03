import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");
const idDropdown = document.getElementById("myDropdown"); // Corrigido o ID para "myDropdown"
const boardsList = document.getElementById("listarItem");
// const columns = document.querySelectorAll(".column"); // Movido para dentro de criaColunas

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
let btndrop = document.querySelector(".dropbtn"); // Variável para o botão do dropdown

/*Recuepra colunas e Tasks*/

async function boardsInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/Boards`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const boards = await response.json();

    if (!boards || boards.length === 0) {
      throw new Error("Nenhum dado encontrado nos boards.");
    }

    boards.forEach((board) => {
      let lista = document.createElement("li");
      lista.innerHTML = `<a id="${board.Id}">${board.Name}</a>`;
      lista.addEventListener("click", (event) => {
        btndrop.innerHTML = event.target.innerHTML;
        limpaBoards(); // Certifique-se que limpaBoards está definida
        chamaBoard(board.Id);
        myFunction(); // Esconde o dropdown após a seleção
      });
      idDropdown.querySelector("ul").appendChild(lista); // Adiciona ao <ul> dentro do dropdown
    });
  } catch (error) {
    console.error("Erro ao buscar informações dos boards:", error);
    idDropdown.querySelector("ul").innerHTML = `<li>Erro ao carregar informações.</li>`;
  }
}



async function chamaBoard(boardId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Board?BoardId=${boardId}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    if (result) {
      carregaColunas(result.Id);
    }
  } catch (error) {
    console.error("Erro ao recuperar board:", error);
  }
}

async function carregaColunas(boardId) {
  try {
    const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    if (result) {
      criaColunas(result);
    }
  } catch (error) {
    console.error("Erro ao carregar colunas:", error);
  }
}


function criaColunas(columnsData) {
  const kanban = document.querySelector('.kanban');
  kanban.innerHTML = ''; // Limpa o conteúdo anterior do Kanban

  columnsData.forEach(async (columnData) => {
    const column = document.createElement('div');
    column.classList.add('column');
    column.innerHTML = `<h2>${columnData.Name}</h2><div class="items-container"></div><button class="new-task-btn">Nova Tarefa</button>`;
    kanban.appendChild(column);

    const tasks = await getTasks(columnData.Id);
    const itemsContainer = column.querySelector('.items-container');

    if (tasks) {
      tasks.forEach(task => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.draggable = true;  // Torna o item arrastável
        item.textContent = task.Name;
        itemsContainer.appendChild(item);

        // Adiciona evento de arrastar para cada item
        item.addEventListener('dragstart', () => {
          item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
        });
      });
    }
  });


  const columns = document.querySelectorAll(".column"); // Seleciona as colunas após a criação
  // Adiciona os eventos de drag and drop para as colunas
  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = document.querySelector(".dragging");
      const itemsContainer = column.querySelector(".items-container");
      const applyAfter = getNewPosition(itemsContainer, e.clientY);

      if (dragging && itemsContainer) {
        if (applyAfter) {
          itemsContainer.insertBefore(dragging, applyAfter.nextElementSibling);
        } else {
          itemsContainer.prepend(dragging);
        }
      }
    });
  });



}


async function getTasks(columnId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar informações: ${response.status} - ${response.statusText}`
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao carregar tasks:", error);
    return null; // Retorna null em caso de erro
  }
}



function limpaBoards() {
  const kanban = document.querySelector('.kanban');
  kanban.innerHTML = ''; // Limpa o kanban para novos boards
}



boardsInfo();

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
