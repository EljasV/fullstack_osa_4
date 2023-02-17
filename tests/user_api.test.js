const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require("../models/user")

const api = supertest(app)


const initialUsers = [
    {
        username: "asdfg",
        name: "Asd fgh",
        password: "aaaaa"
    }, {
        username: "qwerty",
        name: "Q Wert",
        password: "aaaaa"
    }
]


describe("Creating Invalid user", () => {
    test("missing username", async () => {
        const user = {name: "Aaaaa Bbbbb", password: "aaaaa"}
        const modeled = new User(user)
        await api.post("/api/users").send(modeled).expect(400)
    })
    test("missing name", async () => {
        const user = {username: "Aab", password: "aaaaa"}
        const modeled = new User(user)
        await api.post("/api/users").send(modeled).expect(400)
    })
    test("missing password", async () => {
        const user = {username: "Aab", name: "Aaaaa Bbbbb"}
        const modeled = new User(user)
        await api.post("/api/users").send(modeled).expect(400)
    })
    test("password too small", async () => {
        const user = {username: "Aab", name: "Aaaaa Bbbbb", password: "a"}
        const modeled = new User(user)
        await api.post("/api/users").send(modeled).expect(400)
    })
    test("username too small", async () => {
        const user = {username: "Aa", name: "Aaaaa Bbbbb", password: "aaaaa"}
        const modeled = new User(user)
        await api.post("/api/users").send(modeled).expect(400)
    })

})

beforeEach(async () => {
    await User.deleteMany({})
    for (const user of initialUsers) {
        api.post("/api/users").send(user)
    }
})

afterAll(async () => {
    await mongoose.connection.close()
})