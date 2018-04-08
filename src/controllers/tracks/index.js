const Spotify = require('../../services/spotify')

const search = (req, res) => {
  // get the search string
  const query = req.query.q
  Spotify.api({
    url: '/v1/search',
    params: {
      q: query,
      type: 'track'
    }
  })
    .then(response => res.json(response.data))
    .catch(error => res.json(error.data))
}

module.exports = {
  search
}
