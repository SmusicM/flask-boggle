from flask import Flask, session,request, render_template,redirect,flash,jsonify
from boggle import Boggle
from random import randint, choice,sample
import logging

app= Flask(__name__)
app.config['SECRET_KEY'] = "chickensareverycool42"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.debug = True


boggle = Boggle()

BOARD = "board"

@app.route('/')
def boggle_menu():
    return render_template("start_boggle.html")

@app.route('/play_boggle',methods = ['POST'])
def display_board():
    #calls makeboard function to make a board for this instance NOT LITERAL INSTANCE OF
    # and store in session
    board = boggle.make_board()
    #stores this created board in flask session
    session[BOARD] = board
    #return board in json or jsonify with a key and val for flask and ajax
  
    return jsonify({BOARD : board})

#issues in js for correctly displaying score , keeping track of score in server and other minor issues
@app.route('/verify_word',methods = ['POST'])
def verify_word():
    
    word = request.json.get('word')
    app.logger.debug('recieved request data: %s',request.json)
    board = session.get(BOARD)
    app.logger.debug('extracted word is: %s',word)
    if board is None:
        return jsonify('result','could not make board or not made yet')
    result = boggle.check_valid_word(board,word)
    
    return jsonify({'result' : result})


@app.route('/boggle_score_data', methods = ['POST'])
def score_handler():
    data = request.json
    times_played = data.get("timesPlayed")
    highest_score = data.get("highestScore")
    total_current_score = data.get("totalCurrentScore")

    app.logger.debug("highest_score: %s",highest_score)
    app.logger.debug("current_total_score: %s",total_current_score)
    print("score data: times played:",times_played,"highest score: ",highest_score,"current: ",total_current_score)
    return jsonify({"success": True})
    #return jsonify({'timesPlayed' : times_played,'highestScore':highest_score,'totalCurrentScore': total_current_score})