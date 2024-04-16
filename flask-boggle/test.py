from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    
    def setUp(self):
        app.config["TESTING"] = True

    def tearDown(self):
        pass

    def test_display_board(self):
        with app.test_client() as client:
            response = client.post('/play_boggle')
        self.assertEqual(response.status_code,200)

    def test_verify_word_route(self):
        with app.test_client() as client:
            response = client.post('/verify_word',json={'word': 'example'})
        self.assertEqual(response.status_code,200)

    def test_boggle_score_data_route(self):
        data = {
            "timesPlayed" : 1,
            "highestScore" : 100,
            "totalCurrentScore": 50
        }
        with app.test_client() as client:
            response = client.post('/boggle_score_data',json=data)
        self.assertEqual(response.status_code,200)