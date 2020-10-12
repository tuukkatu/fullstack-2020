const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  try {
    const savedBlog = await blog.save()
    res.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter