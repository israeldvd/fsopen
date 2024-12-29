const blogPopulateSelectionOptions = {
  name: 1,
  username: 1,
  id: 1,
};

const blogUserPopulateSelectionOptions = {
  username: 1,
  name: 1
}

const userPopulateSelectionOptions = {
  url: 1,
  title: 1,
  id: 1,
};

module.exports = { blogPopulateSelectionOptions, userPopulateSelectionOptions, blogUserPopulateSelectionOptions };
