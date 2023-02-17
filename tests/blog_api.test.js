const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")
const User = require("../models/user")
const api = supertest(app)


let token = ""

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }
]

test("Right amount of objects is returned", async () => {
    const result = await api.get("/api/blogs").auth(token, {type: "bearer"})
    expect(result.body).toHaveLength(6)
})

test("Returned object must have ID", async () => {
    const result = await api.get("/api/blogs").auth(token, {type: "bearer"})
    for (const blog of result.body) {
        expect(blog.id).toBeDefined();
    }
})

test("Blog posted correctly", async () => {
    const blog = {
        title: "abc",
        author: "123",
        url: "--",
        likes: 1337,
    }
    await api.post("/api/blogs").auth(token, {type: "bearer"}).send(blog).expect(201).expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs").auth(token, {type: "bearer"})

    expect(response.body).toHaveLength(7)
})

test("No likes defaults to zero", async () => {
    const blog = {
        title: "cba",
        author: "321",
        url: "---"
    }
    const response = await api.post("/api/blogs").auth(token, {type: "bearer"}).send(blog);
    expect(response.body.likes).toBeDefined()

})

test("Invalid post results in http 400", async () => {
    const missingTitle = {
        author: "11111",
        url: "---"
    }
    const missingUrl = {
        title: "aaaaa",
        author: "456"
    }
    await api.post("/api/blogs").auth(token, {type: "bearer"}).send(missingTitle).expect(400)
    await api.post("/api/blogs").auth(token, {type: "bearer"}).send(missingUrl).expect(400)


})
test("Delete post", async () => {
    const blog = {
        title: "defg",
        author: "987",
        url: "???",
        likes: 420,
    }
    const response = await api.post("/api/blogs").auth(token, {type: "bearer"}).send(blog);
    const id = response.body.id

    let result = await api.get("/api/blogs").auth(token, {type: "bearer"})

    expect(result.body).toHaveLength(7)

    await api.delete(`/api/blogs/${id}`).auth(token, {type: "bearer"}).expect(204)
    result = await api.get("/api/blogs").auth(token, {type: "bearer"})
    expect(result.body).toHaveLength(6)
})


test("Update post", async () => {
    const blog1 = {
        title: "hijk",
        author: "112233",
        url: "!!!!",
        likes: 0,
    }
    const blog2 = {
        title: "hijk",
        author: "112233",
        url: "!!!!",
        likes: 10,
    }
    const entry = await api.post("/api/blogs").auth(token, {type: "bearer"}).send(blog1)
    const id = entry.body.id

    const updated = await api.put(`/api/blogs/${id}`).auth(token, {type: "bearer"}).send(blog2)
    expect(updated.body.likes).toBe(10)

    const all = await api.get("/api/blogs").auth(token, {type: "bearer"})
    expect(all.body).toHaveLength(7)
})


test("Not authorized",async () => {
    const blog = {
        title: "defg",
        author: "987",
        url: "???",
        likes: 420,
    }
    await api.post("/api/blogs").send(blog).expect(401)
})


beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = {
        username: "asdfg",
        name: "Asd fgh",
        password: "aaaaa"
    }

    await api.post("/api/users").send(user)

    const login = await api.post("/api/login").send(user)
    token = login.body.token
    for (const blog of initialBlogs) {
        await api.post("/api/blogs").auth(token, {type: "bearer"}).send(blog)
    }
})


afterAll(async () => {
    await mongoose.connection.close()
})