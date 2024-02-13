const compareByBlogs = (a, b) => {
  return b.blogs.length - a.blogs.length
}

const compareByLikes = (a, b) => {
  return b.likes - a.likes
}

export default {
  compareByBlogs,
  compareByLikes
}
