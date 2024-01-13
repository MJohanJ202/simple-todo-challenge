import { initNotes } from "./config/initNotes.js"

const $formTodo = document.querySelector("#todo-form");
const $listTodo = document.querySelector("#todo-list");

const createNote = (note) => {
  return { description: note.description, id: crypto.randomUUID() };
};

const setDefaultNotes = () => {
  const notes = JSON.stringify(initNotes) 
  localStorage.setItem("notes", notes)
}

const saveNote = (note) => {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const isNoteSaved = notes.every(({ id }) => id === note.id);

  if (isNoteSaved) return null;

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
};

const deleteNote = (id) => {
  let notes = JSON.parse(localStorage.getItem("notes"))
  ?.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
};

const addItem = (note) => {
  const $listItem = document.createElement("li");
  const $listItemText = document.createElement("p");
  const $listItemBtn = document.createElement("button");
  
  $listItemText.textContent = note.description;
  $listItemBtn.textContent = "Borrar";
  
  $listItem.setAttribute("data-id", note.id);
  $listItem.classList.add("todo-list__item");
  $listItemText.classList.add("todo-list__text");
  $listItemBtn.classList.add("todo-list__btn");

  $listItem.append($listItemText);
  $listItem.append($listItemBtn);
  $listTodo?.append($listItem);
};

const deleteItem = (id) => {
  const $itemToDelete = document.querySelector(`[data-id='${id}']`);
  $listTodo?.removeChild($itemToDelete);
};

$formTodo?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const dataFormTodo = Object.fromEntries(formData);
  const note = createNote(dataFormTodo);
  addItem(note);
  saveNote(note);
  event.target.reset()
});

$listTodo?.addEventListener("click", (event) => {
  if (event.target.localName !== "button") return null;
  const id = event.target.parentElement.dataset.id;
  deleteItem(id);
  deleteNote(id);
});

const renderNotes = () => {
  let notes = JSON.parse(localStorage.getItem("notes"))
  const hasVeryFewNotes = notes.length === 0
  if(notes === null || hasVeryFewNotes) {
    localStorage.setItem("notes", "[]")
    setDefaultNotes(hasVeryFewNotes);
    notes = initNotes;
  }
  notes.forEach(note => addItem(note));
};

renderNotes()
