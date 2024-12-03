import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");
const idDropdown = document.getElementById("myDropdown");
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
let btndrop = document.querySelector(".dropbtn"); // Variável para o botão do dropdown

/*Recuepra colunas e Tasks*/
async function boardsInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/Boards`);
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar informações: ${response.status} - ${response.statusText}`
      );
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
        limpaBoards();
        chamaBoard(board.Id);
        myFunction();
      });
      idDropdown.querySelector("ul").appendChild(lista);
    });
  } catch (error) {
    console.error("Erro ao buscar informações dos boards:", error);
    idDropdown.querySelector(
      "ul"
    ).innerHTML = `<li>Erro ao carregar informações.</li>`;
  }
}

async function chamaBoard(boardId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Board?BoardId=${boardId}`);
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar informações: ${response.status} - ${response.statusText}`
      );
    }
    const boardData = await response.json();
    if (boardData) {
      criaColunas(boardData.Id);
    }
  } catch (error) {
    console.error("Erro ao recuperar board:", error);
    // Lidar com o erro
  }
}

async function criaColunas(boardId) {
  try {
    const columnsData = await buscarDadosColunas(boardId);
    const kanban = document.querySelector(".kanban");
    kanban.innerHTML = ""; // Limpa o kanban

    if (columnsData && columnsData.length > 0) {
      for (const columnData of columnsData) {
        await criarColuna(columnData, kanban);
      }
    } else {
      exibirMensagemSemColunas(kanban);
    }
  } catch (error) {
    console.error("Erro ao criar colunas:", error);
    exibirMensagemErroColunas(kanban);
  }
}

async function buscarDadosColunas(boardId) {
  const response = await fetch(
    `${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`
  );
  if (!response.ok) {
    throw new Error(
      `Erro ao carregar colunas: ${response.status} - ${response.statusText}`
    );
  }
  return await response.json();
}

async function criarColuna(columnData, kanban) {
  const column = document.createElement("div");
  column.classList.add("column");
  column.id = `column-${columnData.Id}`;
  column.innerHTML = `<h2>${columnData.Name}</h2><div id="cards-${columnData.Id}" class="items-container"></div><button class="new-task-btn">Nova Tarefa</button>`;
  kanban.appendChild(column);

  // Carrega as tarefas APÓS a coluna ser adicionada ao DOM
  await carregarTasks(columnData.Id, column.querySelector(".items-container"));
}

function exibirMensagemSemColunas(kanban) {
  kanban.innerHTML = "<p>Nenhuma coluna encontrada para este board.</p>";
}

function exibirMensagemErroColunas(kanban) {
  kanban.innerHTML = "<p>Erro ao carregar as colunas.</p>";
}

async function buscarTasks(columnId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`
    );
    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }
    const tasksData = await response.json();
    console.log(`Tasks para a coluna ${columnId}:`, tasksData);
    return tasksData;
  } catch (error) {
    console.error(`Erro ao buscar tasks para a coluna ${columnId}:`, error);
    return [];
  }
}

async function carregarTasks(columnId, columnCards) {
  try {
    const tasksData = await buscarTasks(columnId);
    exibirTasks(tasksData, columnCards);
  } catch (error) {
    console.error(
      `Erro ao carregar as tasks para a coluna ${columnId}:`,
      error
    );
    columnCards.innerHTML = "<p>Erro ao carregar as tasks.</p>";
  }
}

function exibirTasks(tasksData, columnCards) {
  if (!tasksData || tasksData.length === 0) {
    columnCards.innerHTML = "<p>Nenhuma tarefa nesta coluna.</p>";
    return;
  }

  tasksData.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("item");
    taskItem.innerHTML = `
      <h4>${task.Title}</h4>
      <p>${task.Description}</p>
      `;
    columnCards.appendChild(taskItem);
  });
}

function limpaBoards() {
  const kanban = document.querySelector(".kanban");
  kanban.innerHTML = "";
}

// Inicializa a busca pelos boards
boardsInfo();
