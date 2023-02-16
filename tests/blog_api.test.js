const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")
const {response} = require("express");

const api = supertest(app)
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
    const result = await api.get("/api/blogs")
    expect(result.body).toHaveLength(6)
})

test("Returned object must have ID", async () => {
    const result = await api.get("/api/blogs")
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
    await api.post("/api/blogs").send(blog).expect(201).expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(7)
})

test("No likes defaults to zero", async () => {
    const blog = {
        title: "cba",
        author: "321",
        url: "---"
    }
    const response = await api.post("/api/blogs").send(blog);
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
    await api.post("/api/blogs").send(missingTitle).expect(400)
    await api.post("/api/blogs").send(missingUrl).expect(400)


})


beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog of initialBlogs) {
        const newBlog = new Blog(blog);
        await newBlog.save();
    }
})

afterAll(async () => {
    await mongoose.connection.close()
})