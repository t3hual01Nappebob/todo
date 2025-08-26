import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Row from './components/Row'

const url = 'http://localhost:3001'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.message : error)
      })
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async () => {
    const newTask = { description: task }

    axios.post(`${url}/create`, { task: newTask })
      .then(response => {
        setTasks([...tasks, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.error : error)
      })
  }

  const deleteTask = (deleted) => {
    axios.delete(url + '/delete/' + deleted)
    .then(response => {
      setTasks(tasks.filter(t => t.id !== deleted))
    })
    .catch(error => {
      alert(error.response.data ? error.response.data.error : error)
    })
  }

  return (
    <div id="container">
      <h3>Todos</h3>
      <form>
        <input
          placeholder="Add new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <ul>
  {tasks.map(item => (
    <Row item={item} key={item.id} deleteTask={deleteTask} />
  ))
  }
</ul>
    </div>
  )
}

export default App