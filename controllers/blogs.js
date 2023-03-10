const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = request.user
    const blog = new Blog({...body, user: user.id})

    const result = await blog.save()

    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(204).end()
    }

    if (request.user.id !== blog.user.toString()) {
        return response.status(403).json({error: "No rights to delete"})
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})


module.exports = blogsRouter