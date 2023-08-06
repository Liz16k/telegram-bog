import { logMsgs } from "#config/constants.js";

async function fetchDBCollection(model, options = {}) {
  try {
    const response = await model.find(options);
    return response;
  } catch (error) {
    console.error(logMsgs.ERROR.DB.FETCH, error);
  }
}

export { fetchDBCollection };
