import { expect } from "chai"
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js"

describe("Testing basic database functionality", () => {
    let token = null
    const testUser = { email: "foo@foo.com", password: "password123" }
    
    before(async () => {
        await initializeTestDb()
        token = getToken(testUser.email)
    })

    it("should get all tasks", async () => {
        const response = await fetch('http://localhost:3001/')
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys(['id', 'description'])
    })

    it("should create a new task", async () => {
        const newTask = { description: "Test task" } 
        const response = await fetch('http://localhost:3001/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({task: newTask})
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(['id', 'description'])
        expect(data.description).to.equal(newTask.description)
    })

    it("should delete a task", async () => {
        const newTask = { description: "Task to delete" }
        const createResponse = await fetch('http://localhost:3001/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({task: newTask})
        })
        const createdTask = await createResponse.json()
        
        const response = await fetch(`http://localhost:3001/delete/${createdTask.id}`, { 
            method: 'delete',
            headers: {
                'Authorization': token
            }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(['id'])
    })

    it("should not create a new task without description", async () => {
        const response = await fetch('http://localhost:3001/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({task: {}})
        })
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.have.property('error')
    })
})

describe("Testing user management", () => {
    it("should sign up", async () => {
        const newUser = { email: "signup@test.com", password: "password123" }
        const response = await fetch("http://localhost:3001/user/signup", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: newUser })
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(["id", "email"])
        expect(data.email).to.equal(newUser.email)
    })

    it('should log in', async () => {
        const loginUser = { email: "login@test.com", password: "password123" }
        
        await insertTestUser(loginUser.email, loginUser.password)
        
        const response = await fetch("http://localhost:3001/user/signin", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: loginUser }) 
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["id", "email", "token"])
        expect(data.email).to.equal(loginUser.email)
    })
})