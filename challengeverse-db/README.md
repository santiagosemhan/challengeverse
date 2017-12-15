# challengeverse-db

## Usage

``` js
const setupDatabase = require('challengeverse-db')

setupDabase(config).then(db => {
  const { Restaurant, Order } = db

}).catch(err => console.error(err))
```
