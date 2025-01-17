const listHelper = require("../src/utils/helpers/list_helper");

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "65936732fc13ae59bafa21f8", // "Michael Chan"
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const emptyList = [];
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the like of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(listWithOneBlog[0].likes);
  });

  test("of a bigger list is rightly calculated", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  const listWithOneBlog = [
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
  ];

  const mostFavoredBlog = {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  };

  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });

  test("of one-blog list is itself", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    const { author, title, likes } = listWithOneBlog[0];
    expect(result).toEqual({ author, title, likes });
  });

  test("find the favorite blog", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    const { title, author, likes } = mostFavoredBlog;
    expect(result).toEqual({ title, author, likes });
  });
});

describe("author with most blogs", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  const sampleBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "65936732fc13ae59bafa21f8", // "Michael Chan"
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];

  const authorWithMostBlogs = {
    author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
    blogs: 3,
  };

  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);

    expect(result).toEqual(null);
  });

  test("when list has only one blog is its author", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const { author, blogs } = {
      author: listWithOneBlog[0].author,
      blogs: listWithOneBlog.length, // 1
    };

    expect(result).toEqual({ author, blogs });
  });

  test("of a bigger list is calculated aright", () => {
    const result = listHelper.mostBlogs(sampleBlogs);
    const { author, blogs } = authorWithMostBlogs;

    expect(result).toEqual({ author, blogs });
  });
});

describe("author of most-liked posts", () => {
  const listWithOneBlog = [
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "659367f1fc13ae5aa5fa2124", // "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];
  const mostLikedAuthorAndPosts = {
    author: "65936732fc13ae59bafa2195", // That would be Edsger W. Dijkstra
    likes: 12 + 5,
  };

  test("of an empty list is null", () => {
    const result = listHelper.mostLikes([]);

    expect(result).toBe(null);
  });

  test("of an one-post list is the same author and likes", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    const { author, likes } = listWithOneBlog[0];

    expect(result).toEqual({ author, likes });
  });

  test("of a bigger list is calculated accordingly", () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);

    expect(result).toEqual({
      author: mostLikedAuthorAndPosts.author,
      likes: mostLikedAuthorAndPosts.likes,
    });
  });
});
