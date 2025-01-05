const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")
const { blog, blogs } = require("./test_helper")

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

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
