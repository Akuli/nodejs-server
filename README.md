# Node.js Player Server

This is my first project in node.js, and it runs a server that stores
data about players with a HTTP front end. The players are identified by
unique ID strings.

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

## Installing the server

Make sure that you have Node.js, NPM and MongoDB installed. For example,
you can install them like this on Debian-based Linux distributions:

```
$ sudo apt install mongodb nodejs npm
```

Then you can download the code, install the dependencies and run the
server like this:

```
$ git clone https://github.com/Akuli/nodejs-server
$ cd nodejs-server
$ npm install mongoose http
$ nodejs server.js
```

You need to use `node` instead of `nodejs` in the last command on most
operating systems. Debian-based distributions use `nodejs` because
there's already another package with an executable called `node`.

## Tests

Currently `tests.py` contains quick and dirty tests written in Python.
You can install all of the dependencies that the tests need like this:

```
$ python3 -m pip install --user pytest requests
```

Use `py -3` instead of `python3` on Windows and omit `--user` if you are
using a virtualenv.

Now you can start the server in another terminal or command prompt, and
run the tests like this:

```
$ python3 -m pytest
```
