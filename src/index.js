import { createProject } from "./projects";
import { createTodo } from "./todos";
import "./style.css";


const projects=[]
const general= createProject("General","general")
projects.push(general)

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

function addproject(){
    const name=prompt("Project Name")
    if (!name) return 
    const newId = crypto.randomUUID();
    projects.push(createProject(name,newId))
    render()
}

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
        todoDel.addEventListener("click",()=>{
            project.todos.splice(index,1)
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

function addTodo(){
    const name = prompt("Todo name?");
    if (!name) return;
    const description = prompt("Description?");
    const priority = prompt("Priority (low / medium / high)?");
    const todo= createTodo(name,description,priority)
    const project = projects.find(
    project => project.id === selectedProjectId
    )
    project.todos.push(todo);
    render()
}

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
