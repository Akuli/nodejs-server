# Node.js Player Server

This is my first real project in node.js, and it runs a server that
stores data about players with a HTTP front end. The players are
identified by unique ID strings.

Each player is represented with JSON data like this:

```json
{
    "_id": "this-is-the-magic-ID",
    "name": "Test Player",
    "email": "test.player@example.com",
    "settings": {
        "language": "en_US",
        "difficulty": 3
    },
    "score": 10
}
```

Here's the entire API:

- `GET /api/player/:id`: get all information about a player with ID
  `:id` as JSON
- `POST /api/player`: add a new player based on JSON post data (without
  the `_id`), returns the new ID
- `PUT /api/player`: change information about an existing player
- `DELETE /api/player/:id`: delete a player based on the ID

The HTTP status code is always 200 on success and 400 on failure.
