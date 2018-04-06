const Spotify = require('../../services/spotify')

const handler = (req, res) => {
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
    .catch(err => res.json(error.data))
}

module.exports = {
  handler
}
