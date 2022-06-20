const requestAPi = async (value, perPage, page) => {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${value}+in:name&per_page=${perPage}&page=${page}`
  );

  return response.json();
};

export { requestAPi };
