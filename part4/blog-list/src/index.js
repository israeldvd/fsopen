const { PORT } = require("../src/utils/helpers/config");
const logger = require("../src/utils/helpers/logger");
const app = require("./app");

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
