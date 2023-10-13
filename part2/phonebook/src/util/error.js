export const getErrorFeedback = (error, prependFeedback = true) => {
  let errorMessage = prependFeedback ? "Something went wrong. " : "";

  if ("response" in error && "data" in error.response) {
    errorMessage += `${error.response.data.error}`;
  } else if (error instanceof Error) {
    errorMessage += error.message;
  }

  return errorMessage.trim();
};
