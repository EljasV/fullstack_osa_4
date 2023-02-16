const mostLikes = blogs => {
    let likeCounts = {}
    for (blog of blogs) {
        if (likeCounts[blog.author]) {
            likeCounts[blog.author] += blog.likes
        } else {
            likeCounts[blog.author] = blog.likes
        }
    }

    let best = {author: "", likes: -1}

    for ([author, count] of Object.entries(likeCounts)) {
        if (count > best.likes) {
            best = {author: author, likes: count}
        }
    }
    return best
}

const mostBlogs = blogs => {
    let blogCount = {}
    for (blog of blogs) {
        if (blogCount[blog.author]) {
            blogCount[blog.author]++
        } else {
            blogCount[blog.author] = 1
        }
    }

    let best = {author: "", blogs: -1}

    for ([author, count] of Object.entries(blogCount)) {
        if (count > best.blogs) {
            best = {author: author, blogs: count}
        }
    }
    return best
}


const favoriteBlog = blogs => {
    let best = blogs[0]
    for (let blog of blogs) {
        if (blog.likes > best.likes) {
            best = blog
        }
    }
    return {title: best.title, author: best.author, likes: best.likes}
}
const totalLikes = blogs => {
    let sum = 0
    blogs.forEach(blog => sum += blog.likes)
    return sum
};

const dummy = (blogs) => {
    return 1
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}