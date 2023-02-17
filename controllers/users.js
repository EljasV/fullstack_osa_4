const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate("blogs")
    response.json(users)
})

usersRouter.post('/', async (request, response) => {

    const {username, name, password} = request.body
    const saltRounds = 10

    if (!password) {
        return response.status(400).json({error: "Password needed"})
    }
    if (password.length < 3) {
        return response.status(400).json({error: "Password must be at least 3 characters long."})
    }
    if (!username) {
        return response.status(400).json({error: "Username needed"})
    }
    if (username.length < 3) {
        return response.status(400).json({error: "Username must be at least 3 characters long."})
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)


    const user = new User({username: username, name: name, passwordHash: passwordHash})

    const result = await user.save()

    response.status(201).json(result)
})

module.exports = usersRouter