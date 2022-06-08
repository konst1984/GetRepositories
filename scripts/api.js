export {requestAPi}

const requestAPi = async (value,perPage,page) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=${value}+in:name&per_page=${perPage}&page=${page}`, {
    // headers: {
    //   'Authorization': 'token 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',
    // }
  })
  return response.json();
}

