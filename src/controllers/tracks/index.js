const Spotify = require('../../services/spotify')

const spotify = new Spotify()

const search = (req, res) => {
  // get the search string
  const query = req.query.q
  spotify.api({
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
