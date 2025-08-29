import { useState, useEffect } from 'react'
import '../App.css' 
import axios from 'axios'
import Row from '../components/Row'
import { useUser } from '../context/useUser'

function App() {
    const [task, setTask] = useState('')
    const [tasks, setTasks] = useState([])
    const { user } = useUser()

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL)
            .then(response => {
                setTasks(response.data)
            })
            .catch(error => {
                alert(error.response?.data ? error.response.data.message : error)
            })
    }, [])

    const addTask = async () => {
        const headers = {headers: {Authorization: user.token}}
        const newTask = { description: task }

        axios.post(`${import.meta.env.VITE_API_URL}/create`, {task: newTask}, headers)
            .then(response => {
                setTasks([...tasks, response.data])
                setTask('')
            })
            .catch(error => {
                alert(error.response?.data ? error.response.data.error : error)
            })
    }

    const deleteTask = (deleted) => {
        const headers = {headers: {Authorization: user.token}}
        axios.delete(`${import.meta.env.VITE_API_URL}/delete/${deleted}`, headers)
            .then(response => {
                setTasks(tasks.filter(t => t.id !== deleted))
            })
            .catch(error => {
                alert(error.response?.data ? error.response.data.error : error)
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
                ))}
            </ul>
        </div>
    )
}

export default App