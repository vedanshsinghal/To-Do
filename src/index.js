import { createProject } from "./projects";
import { createTodo } from "./todos";
import "./style.css";

function saveToLocalStorage(){
    localStorage.setItem("projects", JSON.stringify(projects))
}
function loadFromLocalStorage(){
    const data=localStorage.getItem("projects")
    if (!data) return [createProject("General","general")]
    return JSON.parse(data)
}

const projects=loadFromLocalStorage()

const head=document.getElementById("head")
const content=document.getElementById("content")
const body=document.querySelector("body")

const header=document.createElement("h1")
header.textContent="To-Do app"
head.appendChild(header)

function projectRender(){
    const sidebar=document.getElementById("sidebar")
    sidebar.innerHTML=""
    const pro=document.createElement("h1")
    pro.textContent="Your Projects"
    sidebar.appendChild(pro)
    projects.forEach(project=> {
        const row=document.createElement("div")
        row.classList.add("pRow")
        const projectBtn=document.createElement("button")
        const deleteBtn=document.createElement("button")

        projectBtn.textContent=project.name
        deleteBtn.textContent="Delete"

        projectBtn.dataset.id = project.id
        deleteBtn.dataset.id=project.id

        if (project.id===selectedProjectId){
            projectBtn.classList.add("activeProject")
        }

        projectBtn.addEventListener("click",()=>{
            selectedProjectId=project.id
            render()})
        deleteBtn.addEventListener("click",()=>{
            deleteProject(project.id)
            saveToLocalStorage()
            render()})
        row.appendChild(projectBtn)
        row.appendChild(deleteBtn)
        sidebar.appendChild(row)})
    const addProjectBtn=document.createElement("button")
    addProjectBtn.textContent="+"
    addProjectBtn.classList.add("addProBtn")
    addProjectBtn.addEventListener("click",()=>addproject())
    sidebar.appendChild(addProjectBtn)
}
const modal = document.querySelector("#modal-overlay");
const modalForm = document.querySelector("#modal-form");
const projectInput = document.getElementById("projectInput");

function addproject(){
    modal.classList.remove("hidden")
    projectInput.focus()
}

modalForm.addEventListener("submit", (e) => {
    e.preventDefault(); // CRITICAL: Stops page from refreshing!
    const name = projectInput.value
    const newId = crypto.randomUUID();
    projects.push(createProject(name, newId))
    saveToLocalStorage();
    render();
    projectInput.value = ""; 
    modal.classList.add("hidden");
});

let selectedProjectId="general"

function todoRender(){
    content.innerHTML=""

    const project = projects.find(
    project => project.id === selectedProjectId
    );

    project.todos.forEach((todo,index) => {
        const card=document.createElement("div")
        card.classList.add("card")
        const title=document.createElement("h3")
        title.textContent=todo.name
        const desc=document.createElement("p")
        desc.textContent=todo.description
        const priority=document.createElement("p")
        priority.textContent=todo.priority
        desc.classList.add("description")
        priority.classList.add("priority")

        const todoDel=document.createElement("button")
        todoDel.textContent="Delete"
        todoDel.addEventListener("click",(e)=>{
            e.stopPropagation()
            project.todos.splice(index,1)
            saveToLocalStorage()
            render()
        })
        card.appendChild(title)
        card.appendChild(desc)
        card.appendChild(priority)
        card.appendChild(todoDel)
        content.appendChild(card)
        card.addEventListener("click",()=>{
            card.classList.toggle("expanded")
        })
        
    });

}

const addTodoBtn = document.createElement("button")
addTodoBtn.textContent="+"
addTodoBtn.classList.add("todoBtn")
addTodoBtn.addEventListener("click",()=> {addTodo()})
body.appendChild(addTodoBtn)

const todoModal=document.querySelector("#todo-modal")
const todoForm=document.querySelector("#todo-form")
const todoT=document.querySelector("#todoTitle")
const todoD=document.querySelector("#todoDesc")
const todoP=document.querySelector("#todoPriority")
function addTodo(){
    todoModal.classList.remove("hidden")
}
todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const nameTodo = todoT.value
    const todoDescription = todoD.value
    const todoPriority = todoP.value
    const todo= createTodo(nameTodo,todoDescription,todoPriority)
    const project = projects.find(
    project => project.id === selectedProjectId
    )
    project.todos.push(todo)
    //todoT.value=""
    //todoD.value=""
    todoForm.reset() //better
    todoModal.classList.add("hidden")
    saveToLocalStorage()
    render()})



function deleteProject(id){
    if (id=="general"){
        return 
    }
    const index = projects.findIndex(p=>p.id===id)
    projects.splice(index,1)

    if (selectedProjectId===id){
        selectedProjectId="general"
    }
}


function render(){
    projectRender()
    todoRender()
}

render()
