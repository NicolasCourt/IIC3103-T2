const axios = require('axios')
const api_url = 'https://food-api-dev-z2fqxmm2ja-uc.a.run.app'

export function get(path) {
  return axios
    .get(api_url + path, {
      headers: {
        Accept: 'application/json'
      }
    })
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      let response = {
        status: error.response.status,
        data: error.response.data
      };
      return response
    })
}
