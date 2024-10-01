import React, { useEffect, useState } from "react";


const Form = ({ addTask }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input poppins-extralight fs-4 w-100 mb-3"
        type="text"
        placeholder="What needs to be done?"
        onChange={(e) => setTask(e.target.value)}
        value={task}
		style= {{fontWeight: "380"}}
      />
    </form>
  );
};


const Task = ({ task, deleteTask, id }) => {
  return (
    <div className="d-flex justify-content-between align-items-center" style= {{fontWeight: "380"}} >
      <p className="poppins-extralight fs-4" style= {{fontWeight: "380"}}>{task}</p>
      <button className="delete" onClick={() => deleteTask(id)}>
        X
      </button>
    </div>
  );
};


function App() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [userDeleted, setUserDeleted] = useState(false);

  function createUser() {
    fetch(`https://playground.4geeks.com/todo/users/${name}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          alert("user successfully created");
          setUserDeleted((prev) => !prev);
        } else {
          alert("user name already exist or you don't write a validate user name");
        }
      })
      .catch((error) => console.log(error));
  }

  function getUsers() {
    fetch("https://playground.4geeks.com/todo/users")
      .then((response) => response.json())
      .then((data) => setUsersList(data.users));
  }

  function deleteUser() {
    fetch(`https://playground.4geeks.com/todo/users/${name}`, {
      method: "DELETE",
    }).then((data) => {
      if (data.ok) {
        alert("user successfully removed");
        setUserDeleted((prev) => !prev);
      } else {
        alert("you don't write a validate user name to delete");
      }
    });
  }

  function getTaskList() {
    fetch(`https://playground.4geeks.com/todo/users/${name}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.todos) {
          setTasks(data.todos);
        }
      });
  }

  function addTask(task) {
    if (task.trim() === "") {
      alert("You need to add a task");
      return;
    }
    const newTask = {
      label: task,
      is_done: false,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => setTasks((prevTasks) => [...prevTasks, data]))
      .catch((error) => console.log(error));
  }

  function deleteTask(id) {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((data) => {
        if (data.ok) {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } else {
          console.error("failed to delete task");
        }
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getUsers();
  }, [userDeleted]);

  return (
    <div className="container-fluid" style={{ width: "90vw" }}>
      <h2
        className="text-center poppins-thin"
        style={{ color: "red", fontSize: "140px", fontWeight: "200"}}
      >
        todos
      </h2>
      <div className="row">
        <div className="col w-100vw">
          <h3 className="mb-4">Users</h3>
          <select
            className="form-select mb-3"
            id="user-select"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select a user</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <div className="d-flex gap-1">
            <input
              className="form-control me-1"
              type="text"
              style={{ width: "auto", flex: "0 1 auto" }}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="d-flex gap-1">
              <button className="btn btn-danger" onClick={createUser}>
                Create user
              </button>
              <button className="btn btn-danger" onClick={deleteUser}>
                Delete user
              </button>
            </div>
          </div>
        </div>

        <div className="col w-100">
			<div className="d-flex gap-1">
              <h3 className="mb-4">Tasks</h3>
			  <button className="btn btn-danger mb-4" onClick={getTaskList}>
            Get tasks
          </button>
		
            </div>
		  
          
          <div className="border rounded px-4" >
            <Form addTask={addTask} />
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                task={task.label}
                is_done={task.is_done}
                deleteTask={deleteTask}
              />
            ))}
            <div className="poppins-thin" style= {{fontWeight: "380"}}>{tasks.length} item left</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;