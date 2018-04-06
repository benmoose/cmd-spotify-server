const Spotify = require('../../services/spotify')

const handler = (req, res) => {
  // Spotify.api({
  //   url: '/v1/search',
  //   params: {
  //     q: 'forbidden friendship',
  //     type: 'track'
  //   }
  // })

  res.json({
    message: 'hello'
  })
}

module.exports = {
  handler
}
