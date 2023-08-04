async function fetchDBCollection(model, options = {}) {
  try {
    const response = await model.find(options);
    return response;
  } catch (error) {
    console.error("Не удалось получить коллекцию", error);
  }
}

export default { fetchDBCollection };
