document.addEventListener('DOMContentLoaded', () => {

    let projects = {
        default: {} 
    }

    let selectedProject = projects.default;

    const dropdownButton = document.querySelector('.dropdown-button');
    const projDropdownContent = document.querySelector('.pdc');
    const newTaskButton = document.querySelector('.new-task')
    const taskDropdownContent = document.querySelector('.tdc')




    loadFromLocalStorage();
    
    

    function saveToLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('selectedProject', JSON.stringify(selectedProject))
        
    }

    function loadFromLocalStorage() {
        let savedProjects = localStorage.getItem('projects');
        let savedSelectedProject = localStorage.getItem('selectedProject')

        if (savedProjects) {
            projects = JSON.parse(savedProjects);
        }

        if (savedSelectedProject) {
            selectedProject = JSON.parse(savedSelectedProject)
        } 

    displayProjects();
    displayTasks();

    return savedSelectedProject
    
    }



    function displayProjects() {

        projDropdownContent.innerHTML = '';

        for (const projectName in projects) {
            const projectItem = document.createElement('div');
            projectItem.classList.add('dropdown-item');
            projectItem.setAttribute('data-value', projectName);
            
            const projectItemText = document.createElement('span')
            projectItemText.textContent = projectName;
            projectItemText.classList.add('dropdown-item-text');
            projectItem.appendChild(projectItemText);

            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'ⓧ';
            deleteButton.classList.add('project-delete-button');

            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();

                delete projects[projectName];

                if (projects[projectName] === selectedProject) {
                    selectedProject = projects.default;
                }
                displayProjects();
                displayTasks();
                saveToLocalStorage();
            });

            
            projectItem.appendChild(deleteButton);

            if (projects[projectName] === selectedProject) {
                projectItem.classList.add('selected-project')
            }

            projDropdownContent.appendChild(projectItem);
        }

            const newProjectButton = document.createElement('div');
            newProjectButton.classList.add('dropdown-item')
            newProjectButton.setAttribute('id', 'new-project-button');
            newProjectButton.textContent = 'New Project +';
            projDropdownContent.appendChild(newProjectButton);


            let selectedProjectName = Object.keys(projects).find(
                (key) => projects[key] === selectedProject
            );
            dropdownButton.textContent = selectedProjectName || 'Select Project';
            
            displayTasks();
            saveToLocalStorage();
    }
    
    dropdownButton.addEventListener('mouseenter', () => {
        projDropdownContent.style.display = 'block';
    });
    
    dropdownButton.addEventListener('mouseleave', () => {
        projDropdownContent.style.display = 'none';
    });
    
    projDropdownContent.addEventListener('mouseenter', () => {
        projDropdownContent.style.display = 'block';
    });
    




    projDropdownContent.addEventListener('click', (event) => {
        const value = event.target.getAttribute('data-value');

        if (value) { 
            selectedProject = projects[value];
            projDropdownContent.style.display = 'none';  
            displayProjects();
            saveToLocalStorage();
        } else if (event.target.id === 'new-project-button') {
            projectForm()
        }

    });

    function projectForm () {

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-project-input';
    input.classList.add('new-project-input');
    input.placeholder = 'Enter project name';

    const newProjectButton = document.querySelector('#new-project-button')
    newProjectButton.replaceWith(input);
    input.focus();

    const submitButton = document.createElement('button');
    submitButton.classList.add('project-submit-button')
    submitButton.textContent = '✔'

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('project-cancel-button');
    cancelButton.textContent = '×';

    input.after(submitButton, cancelButton);

    submitButton.addEventListener('click', () => {
        const projectName = input.value.trim();

        if (projectName && !projects[projectName]) {
            projects[projectName] = {}
            selectedProject = projects[projectName];
            displayProjects();
            saveToLocalStorage();
        }
        
            
            input.replaceWith(newProjectButton);
            submitButton.remove();
            cancelButton.remove();
        
    })

    cancelButton.addEventListener('click', () => {
        input.replaceWith(newProjectButton);
        submitButton.remove();
        cancelButton.remove();
    })
}


newTaskButton.addEventListener('click', () => { 
    taskForm()
})




function displayTasks () {

    let tasksContainer = document.querySelector('.tasks-container');

    if (!tasksContainer) {
        tasksContainer = document.createElement('div');
        tasksContainer.classList.add('tasks-container');
        document.body.appendChild(tasksContainer);
    }

    tasksContainer.innerHTML = '';
    

    for (const task in selectedProject) {
    
    
    const taskCard = document.createElement('div');
    taskCard.classList.add('task')

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('task-delete');

    deleteButton.addEventListener('click', () => {
        delete selectedProject[task]
        displayTasks();
        saveToLocalStorage();
    })


    const taskName = document.createElement('h3');
    taskName.classList.add('task-name');
    taskName.textContent = selectedProject[task].name;

    const taskDescription = document.createElement('p');
    taskDescription.classList.add('task-description');
    taskDescription.textContent = `Description: ${selectedProject[task].description}`;

    const taskDueDate = document.createElement('time');
    taskDueDate.classList.add('task-due-date');
    taskDueDate.textContent = `Due Date: ${selectedProject[task].dueDate}`;

    const taskPriority = document.createElement('p');
    taskPriority.classList.add('task-priority');
    taskPriority.textContent = `Priority: ${selectedProject[task].priority}`;


    taskCard.appendChild(deleteButton)
    taskCard.appendChild(taskName)
    taskCard.appendChild(taskDescription)
    taskCard.appendChild(taskDueDate)
    taskCard.appendChild(taskPriority)
    tasksContainer.appendChild(taskCard)
    
    }



    


}

function taskForm () {
    taskDropdownContent.innerHTML = '';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'task-title-input';
    titleInput.classList.add('dropdown-input', 'task-title-input');
    titleInput.placeholder = 'Enter task name';
    taskDropdownContent.appendChild(titleInput)

    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'task-description-input';
    descriptionInput.classList.add('dropdown-input', 'task-description-input');
    descriptionInput.placeholder = 'Enter task description';
    taskDropdownContent.appendChild(descriptionInput)

    const dueDate = document.createElement('div');
    dueDate.classList.add('due-date-box');

    const dueDateSpan = document.createElement('span');
    dueDateSpan.textContent = 'Due:'
    dueDateSpan.classList.add('due-date-span');

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.id = 'task-due-date-input';
    dueDateInput.classList.add('task-due-date-input');

    taskDropdownContent.appendChild(dueDate);
    dueDate.appendChild(dueDateSpan);
    dueDate.appendChild(dueDateInput);

    const priority = document.createElement('div');
    priority.classList.add('priority-box');

    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = 'Priority:'
    prioritySpan.classList.add('priority-span');

    const priorityInput = document.createElement('input');
    priorityInput.type = 'number';
    priorityInput.min = '1';
    priorityInput.max = '9'
    priorityInput.id = 'priority-input';
    priorityInput.classList.add('priority-input');

    taskDropdownContent.appendChild(priority);
    priority.appendChild(prioritySpan);
    priority.appendChild(priorityInput);

    const submit = document.createElement('div');
    submit.classList.add('dropdown-input', 'submit')

    const submitButton = document.createElement('button');
    submitButton.classList.add('task-submit-button')
    submitButton.textContent = 'Submit';
    taskDropdownContent.appendChild(submit);
    submit.appendChild(submitButton)

    newTaskButton.addEventListener('mouseenter', () => {
        taskDropdownContent.style.display = 'block';
    });
    
    newTaskButton.addEventListener('mouseleave', () => {
        taskDropdownContent.style.display = 'none';
    });
    
    taskDropdownContent.addEventListener('mouseenter', () => {
        taskDropdownContent.style.display = 'block';
    });

    submitButton.addEventListener('click', () => {
        const taskName = titleInput.value.trim();
        const taskDescription = descriptionInput.value.trim();
        const taskDueDate = dueDateInput.value.trim();
        const taskPriority = priorityInput.value.trim();

            if (taskName && taskDescription && taskDueDate && taskPriority && !selectedProject.hasOwnProperty(taskName)) {
                const task = {
                    name: taskName,
                    description: taskDescription,
                    dueDate: taskDueDate,
                    priority: taskPriority
                };
                console.log(selectedProject)
                selectedProject[taskName] = task; 
                titleInput.value = '';
                descriptionInput.value = '';
                dueDateInput.value = '';
                priorityInput.value = '';
                taskDropdownContent.style.display = 'none'
                displayTasks()
                saveToLocalStorage();
            } else {
                alert('Please enter all fields and ensure the task name is unique.')
            }

                
    })

        
}
    

displayProjects();
displayTasks();



    
})
    
    
