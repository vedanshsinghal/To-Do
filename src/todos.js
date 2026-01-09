function createTodo(name,description,priority,completed=false){
    return {
        name,description,priority,completed
    }
}

export {createTodo}