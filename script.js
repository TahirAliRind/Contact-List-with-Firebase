const todoInput = document.getElementById('todo-input1');
const todoNumberInput = document.getElementById('todo-input2');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');




function addTask() {

    
    const taskText = todoInput.value.trim();
    const taskNumber = todoNumberInput.value.trim();

    if (taskText === '' || taskNumber === '') {
        alert('Please enter both a task and a number!');
        return;
    }

    var li = document.createElement('li');
    li.className = 'task-item';

    var span = document.createElement('span');
    var numberSpan = document.createElement('span');
    numberSpan.className = 'task-number';
    numberSpan.innerText = taskNumber;
    
    span.className = 'task-text';
    span.innerText = taskText;
    li.append(span, numberSpan);

    
   


    









      var actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    var editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerText = 'Edit';


    editBtn.onclick = function () {
        const currentText = span.innerText;
        var newinp = document.createElement('input');
        var Newinp1 = document.createElement('input');

        newinp.type = 'text';
        newinp.value = currentText;
        li.replaceChild(newinp, span);
        newinp.focus();

        Newinp1.type = 'number';
        Newinp1.value = taskNumber;
        li.replaceChild(Newinp1, numberSpan);
        var saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.className = 'save-btn';
        li.appendChild(saveBtn);
        editBtn.replaceWith(saveBtn);

        saveBtn.onclick = function () {
            if (newinp.value.trim() !== "") {
                span.innerText = newinp.value.trim();
                numberSpan.innerText = Newinp1.value.trim();
            }
            li.replaceChild(span, newinp);
            li.replaceChild(numberSpan, Newinp1);
            saveBtn.replaceWith(editBtn);

            // Firebase update function call
            editOnFirebase(li, newinp.value.trim(), Newinp1.value.trim());
        }

        if (newinp !== null && newinp.value.trim() !== "") {
            span.innerText = newinp.value.trim();
            numberSpan.innerText = Newinp1.value.trim();
        }
    };


    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = 'Delete';

    deleteBtn.onclick = function () {
         // --- FIREBASE SE DELETE KARNE KE LIYE ---
    DeleteFromFirebase(li); 

    // UI se hata rahe hain
    li.remove(); 
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(actionsDiv);


    span.onclick = function () {
        li.classList.toggle('completed');
    };

    taskList.appendChild(li);



       UploadOnFirebase();

}

addBtn.addEventListener('click', addTask);

todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});





async function UploadOnFirebase() {
    
    var span = document.getElementById("todo-input1");
    var number = document.getElementById("todo-input2");
    console.log("span", span);
    console.log("number", number);

    // 2. Firebase se unique key generate karna
    var keyValueFirebase = await firebase.database().ref("user").push().key;


    var keyValueFirebaseObj = {
        key: keyValueFirebase,
        span: span.value,
        number: number.value
    }


    try {
        await firebase.database().ref("NewTodo").child(keyValueFirebase).set(keyValueFirebaseObj);
        console.log("Data successfully saved!");
        alert("Data Uploaded!");

        // --- BASS YEH EK LINE ADD KAREIN ---
        // Jo task abhi screen par add hua hai, us li par hum firebase ki key laga rahe hain
        taskList.lastElementChild.setAttribute('data-fb-key', keyValueFirebase);

        todoInput.value = '';
        todoNumberInput.value = '';
    } catch (error) {
        console.error("Error saving data:", error);
    }
}



async function editOnFirebase(liElement, newText, newNumber) {
    // HTML element se uski Firebase key nikalte hain
    const firebaseKey = liElement.getAttribute('data-fb-key');

    if (!firebaseKey) {
        console.error("Firebase key nahi mili!");
        return;
    }
// Bina kisi import ke database mein direct update query
    try {
        await firebase.database().ref("NewTodo").child(firebaseKey).update({
            span: newText,
            number: newNumber
        });
        console.log("Firebase data successfully re-edited!");
    } catch (error) {
        console.error("Firebase update failed:", error);
    }

}





// Database se task delete karne ka alag function
async function DeleteFromFirebase(liElement) {
    // HTML element se uski Firebase key nikalte hain
    const firebaseKey = liElement.getAttribute('data-fb-key');

    if (!firebaseKey) {
        console.error("Firebase key nahi mili!");
        return;
    }

    // Bina kisi import ke database se node ko remove karna
    try {
        await firebase.database().ref("NewTodo").child(firebaseKey).remove();
        console.log("Data successfully deleted from Firebase!");
    } catch (error) {
        console.error("Firebase delete failed:", error);
    }
}




function fetchAllTodos()  {

      const todoRef = firebase.database().ref('NewTodo');
      todoRef.once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          
          
          snapshot.forEach((childSnapshot) => {
            
            const todoKey = childSnapshot.key;    
            const todoData = childSnapshot.val();
            
            console.log("Todo ID: ", todoKey);
            console.log("Todo Data: ", todoData);


var li = document.createElement('li');
    li.className = 'task-item';

    var span = document.createElement('span');
    var numberSpan = document.createElement('span');
    numberSpan.className = 'task-number';
    numberSpan.innerText = todoData.number;
    
    span.className = 'task-text';
    span.innerText = todoData.span;
    li.append(span, numberSpan);

taskList.appendChild(li);


             });

        } else {
          console.log("NewTodo folder me koi data nahi mila.");
        }
      })
      .catch((error) => {
        console.error("Data fetch karne me error aya:", error);
      });
      
}


fetchAllTodos();