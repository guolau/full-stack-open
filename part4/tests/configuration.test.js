const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const blog = {
  _id: "5a422bc61b54a676234d17fc",
  title: "Type wars",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 2,
  __v: 0,
}

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
]

describe("total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test("when only one blog the number of likes is equal to that", () => {
    assert.strictEqual(listHelper.totalLikes([blog]), 2)
  })

  test("of a longer list is calculated correctly", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 34)
  })
})

describe("favorite blog", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test("of list with one blog is equal to that blog", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([blog]), blog)
  })

  test("of longer list is calculated correctly", () => {
    const expected = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    }

    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), expected)
  })
})

describe("most blogs", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test("of list with one blog is calculated correctly", () => {
    assert.deepStrictEqual(listHelper.mostBlogs([blog]), {
      author: "Robert C. Martin",
      blogs: 1,
    })
  })

  test("of longer list is calculated correctly", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: "Edsger W. Dijkstra",
      blogs: 2,
    })
  })
})

describe("most likes", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test("of list with one blog is calculated correctly", () => {
    assert.deepStrictEqual(listHelper.mostLikes([blog]), {
      author: "Robert C. Martin",
      likes: 2,
    })
  })

  test("of longer list is calculated correctly", () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    })
  })
})
