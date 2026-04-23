const app = require('./src/config/app')
const config = require('./src/config')

const PORT = config.port

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
  console.log(` API Documentation available at http://localhost:${PORT}/api`)
  console.log(` Backend Structure: /src/config, /src/models, /src/controllers, /src/routes, /src/middleware, /src/utils`)
})
