const Blog = require("../src/models/blog");
const {
  blogPopulateSelectionOptions,
  userPopulateSelectionOptions,
} = require("../src/models/model-options");
const User = require("../src/models/user");
const Encrypter = require("../src/utils/helpers/encrypter");

const initialBlogList = [
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
    author: "65936732fc13ae59bafa2195",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const initialUsersList = [
  {
    name: "Alidia Jewes",
    email: "ajewes0@huffingtonpost.com",
    username: "ajewes0",
    password: "lP2=r(5~AH3+qL",
  },
  {
    name: "Vladamir Downe",
    email: "vdowne1@bandcamp.com",
    username: "vdowne1",
    password: "yZ9+7VQGL&M}.",
  },
  {
    name: "Carolin Buey",
    email: "cbuey2@cargocollective.com",
    username: "cbuey2",
    password: "hD5>d/D+opS&mR",
  },
  {
    name: "Richart Astin",
    email: "rastin3@cdc.gov",
    username: "rastin3",
    password: "hT3/I\\U35~.F6?g",
  },
  {
    name: "Dagny Tieraney",
    email: "dtieraney4@webeden.co.uk",
    username: "dtieraney4",
    password: "lG5*OVE|",
  },
  {
    _id: "65936732fc13ae59bafa21f8",
    name: "Michael Chan",
    email: "mboaler5@cornell.edu",
    username: "mchan5",
    password: "rU2=~sCKC",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "none",
    likes: 0,
    url: "removed.com",
    author: "659766157edbf0a6c70a34f4", // dummy author ID
    content: "willremovethissoon",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const getInitialUserListForDb = async () => {
  const encrypter = new Encrypter();

  const promiseArray = initialUsersList.map(async (user) => {
    const hash = await encrypter.encrypt(user.password);
    return {
      ...user,
      passwordHash: hash,
    };
  });

  const initialUsersListWithHashes = await Promise.all(promiseArray);
  return initialUsersListWithHashes;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const blogsInDbPopulated = async () => {
  const populatedBlogs = await Blog.find({}).populate(
    "author",
    blogPopulateSelectionOptions
  );

  return populatedBlogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const usersInDbPopulated = async () => {
  const populatedUsers = await User.find({}).populate(
    "blogs",
    userPopulateSelectionOptions
  );
  return populatedUsers.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogList,
  nonExistingId,
  getInitialUserListForDb,
  blogsInDb,
  blogsInDbPopulated,
  initialUsersList,
  usersInDb,
  usersInDbPopulated,
};
