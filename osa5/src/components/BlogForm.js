import React, {useState} from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogForm = () => {

  const [newBlog, setNewBlog] = useState('')
  const [blogs, setBlogs] = useState([])

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog,
      author: newBlog
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
      })
  }

  return (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
    </form>
  )
}

export default BlogForm