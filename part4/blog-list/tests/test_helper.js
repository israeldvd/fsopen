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

const initialIntegrationBlogs = [
  {
    author: "659da346fc13ae5978fa20b9",
    title: "Breast Men",
    likes: "14246",
    url: "https://nature.com",
  },
  {
    author: "659da346fc13ae5978fa20ba",
    title: "Home",
    likes: "67",
    url: "https://csmonitor.com",
  },
  {
    author: "659da346fc13ae5978fa20bb",
    title: "Detroit",
    likes: "281",
    url: "https://mit.edu",
  },
  {
    author: "659da346fc13ae5978fa20bc",
    title: "Locke",
    likes: "03",
    url: "https://home.pl",
  },
  {
    author: "659da346fc13ae5978fa20bd",
    title: "Dream Land",
    likes: "2122",
    url: "https://linkedin.com",
  },
  {
    author: "659da346fc13ae5978fa20be",
    title: "Daar",
    likes: "59",
    url: "http://icq.com",
  },
  {
    author: "659da346fc13ae5978fa20bf",
    title: "Adventures of Felix, The (a.k.a. Funny Felix) (Drôle de Félix)",
    likes: "9996",
    url: "https://nature.com",
  },
  {
    author: "659da346fc13ae5978fa20c0",
    title: "Run Ronnie Run",
    likes: "9002",
    url: "http://cbslocal.com",
  },
  {
    author: "659da346fc13ae5978fa20c1",
    title: "Joker Is Wild, The (All the Way)",
    likes: "16508",
    url: "https://biblegateway.com",
  },
  {
    author: "659da346fc13ae5978fa20c2",
    title: "I Became a Criminal (They Made Me a Fugitive)",
    likes: "560",
    url: "http://eepurl.com",
  },
  {
    author: "659da346fc13ae5978fa20c3",
    title: "Life of Emile Zola, The",
    likes: "037",
    url: "https://phoca.cz",
  },
  {
    author: "659da346fc13ae5978fa20c4",
    title: "Zatoichi's Cane Sword (Zatôichi tekka tabi) (Zatôichi 15)",
    likes: "2",
    url: "http://redcross.org",
  },
  {
    author: "659da346fc13ae5978fa20c5",
    title: "Blind Dating",
    likes: "7",
    url: "http://stanford.edu",
  },
  {
    author: "659da346fc13ae5978fa20c6",
    title: "Black Christmas",
    likes: "43885",
    url: "https://youtube.com",
  },
  {
    author: "659da346fc13ae5978fa20c7",
    title: "Paradise",
    likes: "680",
    url: "https://unesco.org",
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

const initialLoginUserList = [
  {
    name: "Almeda Capps",
    email: "acapps0@unc.edu",
    username: "acapps0",
    password: "rT6~mm\\Xf'$",
  },
  {
    name: "Jeanne Witchard",
    email: "jwitchard1@imgur.com",
    username: "jwitchard1",
    password: "rX8|WJ%#5T55MP",
  },
  {
    name: "Carce Hillam",
    email: "chillam2@spotify.com",
    username: "chillam2",
    password: "sW9$#<4R%oFY",
  },
  {
    name: "Findlay Woodrooffe",
    email: "fwoodrooffe3@bigcartel.com",
    username: "fwoodrooffe3",
    password: "tQ8*w7'W}}B",
  },
  {
    name: "Jeromy Klimsch",
    email: "jklimsch4@list-manage.com",
    username: "jklimsch4",
    password: "yQ3)>lD*jtpvr?Q",
  },
];

const initialIntegrationUsers = [
  {
    name: "Phillis Beining",
    email: "pbeining0@posterous.com",
    username: "pbeining0",
    password: "pY4<H`@R%X$HuSe~",
  },
  {
    name: "Sarge Stuchbery",
    email: "sstuchbery1@tinyurl.com",
    username: "sstuchbery1",
    password: "gQ2(q|/!~",
  },
  {
    name: "Molly Dignum",
    email: "mdignum2@behance.net",
    username: "mdignum2",
    password: "lR7+j\\Wlb<AmAy",
  },
  {
    name: "Jonis Brotherick",
    email: "jbrotherick3@tamu.edu",
    username: "jbrotherick3",
    password: "rE0'GoqD0{g5lJ5Z",
  },
  {
    name: "Micaela Olyonov",
    email: "molyonov4@washingtonpost.com",
    username: "molyonov4",
    password: "zU7!\\N5lEH9Cl&iX",
  },
  {
    name: "Hamlen Behnke",
    email: "hbehnke5@feedburner.com",
    username: "hbehnke5",
    password: "pU4}Eww5l&|n'mR",
  },
  {
    name: "Anabella O'Ferris",
    email: "aoferris6@ucoz.ru",
    username: "aoferris6",
    password: "cT5`nA*%",
  },
  {
    name: "Goddart Buckel",
    email: "gbuckel7@home.pl",
    username: "gbuckel7",
    password: "bU8}*X_Bj/Y",
  },
  {
    name: "Terrel Fairleigh",
    email: "tfairleigh8@ft.com",
    username: "tfairleigh8",
    password: "wL6/w)nE@",
  },
  {
    name: "Zollie Bischof",
    email: "zbischof9@google.cn",
    username: "zbischof9",
    password: "fT0('>U|H`",
  },
  {
    name: "Kit Lapish",
    email: "klapisha@github.io",
    username: "klapisha",
    password: "fB2|<!1O'9fk",
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

const transformUserListForDb = async (list) => {
  const encrypter = new Encrypter();

  if (!Array.isArray(list)) {
    throw new TypeError("Provided list is not an array!");
  }

  const promiseArray = list.map(async (user) => {
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
  initialIntegrationBlogs,
  initialLoginUserList,
  initialIntegrationUsers,
  nonExistingId,
  transformUserListForDb,
  blogsInDb,
  blogsInDbPopulated,
  initialUsersList,
  usersInDb,
  usersInDbPopulated,
};
