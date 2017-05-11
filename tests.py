import copy
import requests


# change this to use a different host or port
URL = 'http://localhost:9999/api/player/'

default_player = {
    "name": "Test Player",
    "email": "test.player@example.com",
    "settings": {
        "language": "en_US",
        "difficulty": 3,
    },
    "score": 10,
}


def succeeds(response):
    return response.status_code == 200


def fails(response):
    return response.status_code == 400


def test_most_things():
    player = copy.deepcopy(default_player)

    response = requests.post(URL, json=player)
    assert succeeds(response)
    player['_id'] = response.text

    response = requests.get(URL + player['_id'])
    assert succeeds(response)
    assert response.json() == player

    # this is kind of a corner case because the difficulty is stored in
    # a nested mapping
    player['settings']['difficulty'] = 10
    response = requests.put(URL, json={
        '_id': player['_id'],
        'settings': {"difficulty": 10},
    })
    assert succeeds(response)

    response = requests.get(URL + player['_id'])
    assert succeeds(response)
    assert response.json() == player

    response = requests.delete(URL + player['_id'])
    assert succeeds(response)


def test_get_errors():
    assert fails(requests.get(URL))                 # missing ID
    assert fails(requests.get(URL + 'asdfasdf'))    # invalid ID


def test_post_errors():
    invalid_field_player = copy.deepcopy(default_player)
    invalid_field_player['settings']['lol'] = 123

    assert fails(requests.post(URL + 'asdfasdf'))   # should be no ID
    assert fails(requests.post(URL, json={}))       # missing fields
    assert fails(requests.post(URL, json=invalid_field_player))


def test_delete_errors():
    assert fails(requests.delete(URL))              # missing ID
    assert fails(requests.delete(URL + 'asdf'))     # invalid ID


def test_put_errors():
    assert fails(requests.put(URL, json={}))    # missing ID in json
    assert fails(requests.put(URL + 'asdf'))    # ID shouldn't be in the URL
    assert fails(requests.put(URL, json={'lol': 123}))  # invalid key
