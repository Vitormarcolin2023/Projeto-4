import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";
import { saveToLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");
const recuperarBoard = getFromLocalStorage("board");
const recuperaColumn = getFromLocalStorage("coluna");
const idDropdown = document.getElementById("myDropdown");

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
let btndrop = document.querySelector(".dropbtn");

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
        const boardDescricao = document.getElementById("descrição-board");
        boardDescricao.innerHTML = `<h4>${board.Description}</h4>`;
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
      saveToLocalStorage("board", { id: boardData.Id });
    }
  } catch (error) {
    console.error("Erro ao recuperar board:", error);
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

function criarColuna(columnData, kanban) {
  const column = document.createElement("div");
  column.classList.add("column");
  column.id = `column-${columnData.Id}`;
  column.innerHTML = `<button data-column-id="${columnData.Id}" class="deltet-column-btn">
    <i class="bi bi-trash3-fill"></i>    
  </button>
  <h2>${columnData.Name}</h2>
  <div id="cards-${columnData.Id}" class="items-container">
  </div>
  <button data-column-id="${columnData.Id}" class="new-task-btn" onclick="funcCriarTaks()">
    Nova Tarefa
  </button>`;

  const newTaskBtn = column.querySelector(".new-task-btn");
  newTaskBtn.addEventListener("click", passarIdDaColum);

  const selecionaIdParaExcluir = column.querySelector(".deltet-column-btn");
  selecionaIdParaExcluir.addEventListener("click", passarIdDaColum);

  kanban.appendChild(column);
  carregarTasks(columnData.Id, column.querySelector(".items-container"));
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

//Exclui Board
document
  .getElementById("excluirBoard")
  .addEventListener("click", async function () {
    const boardId = recuperarBoard.id;
    const endpoint = `${API_BASE_URL}/Board?BoardId=${boardId}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Board excluído com sucesso.");
        limpaBoards();
        idDropdown.querySelector("ul").innerHTML = "";
        boardsInfo();
        document.getElementById("descrição-board").innerHTML = "";
        localStorage.removeItem("board");
        alert("Board excluído com sucesso!");
      } else {
        console.error(
          `Erro ao excluir board: ${response.status} - ${response.statusText}`
        );
        const errorData = await response.json();
        alert(
          `Erro ao excluir board: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Erro ao excluir board:", error);
      alert("Erro ao excluir board. Verifique sua conexão com a internet.");
    }
  });

//Excluir coluna
async function excluirColumns(columnId) {
  console.log("Column ID (função de excluir):", columnId);
  const endpoint = `${API_BASE_URL}/Column?ColumnId=${columnId}`;

  try {
    const response = await fetch(endpoint, { method: "DELETE" });
    if (response.ok) {
      const columnElement = document.getElementById(`column-${columnId}`);
      if (columnElement) {
        columnElement.remove();
        columnElement.querySelector("div").innerHTML = "";
      }
      alert("Coluna excluída com sucesso!");
    } else {
      const errorData = await response.json();
      console.error(
        `Erro ao excluir coluna: ${response.status} - ${response.statusText}`
      );
      alert(
        `Erro ao excluir coluna: ${errorData.message || response.statusText}`
      );
    }
  } catch (error) {
    console.error("Erro ao excluir coluna:", error);
    alert("Erro ao excluir coluna. Verifique sua conexão com a internet.");
  }
}

function passarIdDaColum(event) {
  const columnId = event.target.dataset.columnId;
  saveToLocalStorage("coluna", { id: columnId });
  console.log("ID da coluna clicada:", columnId);

  if (event.target.classList.contains("deltet-column-btn")) {
    excluirColumns(columnId);
  }
}

function limpaBoards() {
  const kanban = document.querySelector(".kanban");
  kanban.innerHTML = "";
}

boardsInfo();
