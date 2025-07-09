export function getFriendlyErrorMessage(error) {
    if (!error) return "Something went wrong.";
  
    if (typeof error === "string") {
      if (error.includes("403")) return "You are not authorized to view this content.";
      if (error.includes("401")) return "You need to log in to continue.";
      if (error.includes("404")) return "We couldn’t find what you were looking for.";
      if (error.includes("500")) return "Server error. Please try again later.";
      return error;
    }
  
    if (error.response && error.response.status) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return "Bad request. Something’s off with the data.";
        case 401:
          return "Unauthorized. Please log in.";
        case 403:
          return "Access denied. You don’t have permission.";
        case 404:
          return "Not found. The resource doesn't exist.";
        case 500:
          return "Internal server error. Please try again later.";
        default:
          return "Unexpected error occurred.";
      }
    }
  
    return "An unknown error occurred.";
  }
  