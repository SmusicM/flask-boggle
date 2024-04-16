

$(document).ready(function(){
   
    const startBoggle = $('#start-boggle');
    const userWordForm = $('#user-word-form');
    const gameContainer = $('#game-board-container')
    const wordInput = $('#word');
    const resultMessage = $('#result-container');
    const timerDisplay = $('#timer-display');
    const timerContainer = $('#timer-container')
    const scoreContainer = $('#score-container')
    const scoreDisplay = $('#score-display')
 
    let timerHandle;
    let secondsforgame = 60;

    let totalCurrentScore = 0;
    let highestScore = 0;
    let timesPlayed = 0;

   function startTimer(){
    clearInterval(timerHandle)
     timerHandle = setInterval(()=>{
        secondsforgame--;
        if(secondsforgame >= 0){
         timerDisplay.text(secondsforgame + "s");
        }else{
            clearInterval(timerHandle);
            alert("TIMES UP MATE!")
            
            
            scoreKeeper();
            
            //resetGame()
           
            //timerContainer.empty()   implement something like this for when before start button is clicked timer doesnt display
        }
     },1000)
   }


   function updateScoreFrontEnd(){
    //totalCurrentScore++
    totalCurrentScore += wordInput.val().length
    scoreDisplay.text("score: " + totalCurrentScore)
   }

   function scoreKeeper(){
    console.log(" scorekeeper top : total current score", totalCurrentScore)
     console.log("highest score",highestScore)
     console.log("times played", timesPlayed)
     clearInterval(timerHandle);
     timesPlayed++;
     if (totalCurrentScore > highestScore){
        highestScore = totalCurrentScore;
     }
     updateScoreFrontEnd();
     console.log("total current score", totalCurrentScore)
     console.log("highest score",highestScore)
     console.log("times played", timesPlayed)
     $.ajax({
        type: "POST",
        url: "/boggle_score_data",
        contentType: "application/json",
        data: JSON.stringify({
            timesPlayed: timesPlayed,
            highestScore: highestScore,
            totalCurrentScore: totalCurrentScore
        }),
        success: function(response){
            console.log("score keeper is working!",response)
            resetGame()
        },
        error: function(xhr,status,error){
            console.error("error with score data",error)
            resetGame();
        }
     });
     //resetGame()
   }


 //issue here is the timer is reset yes, but its through basic front end stuff and also after clicking ok on alert it bring you back and reset timer but its half assardly
 //also still issues with hiding timer, i feel this whole thing shoulf be done by the start button using more back end things to do so
 //notice when hit ok and strt button again it shows 60 seonds to the countdown
 //also FIX THIS MAKE HIDING ACTION BETTER AND MORE DEFINED THIS IS TEMP, REMEMEBER YOUR DISPLAYING FUNCTION FOR THE BOGGLE BOARD ARE BELOW NOT THIS THIS IS JUST FOR TIMER
  function resetGame(){
    clearInterval(timerHandle);
    startBoggle.show()
    userWordForm.hide()
    gameContainer.empty()
    secondsforgame = 60
    timerDisplay.text(secondsforgame + 's')
    scoreDisplay.text("score: "+ totalCurrentScore)
    timerContainer.hide()
    resultMessage.empty()
    scoreContainer.hide()
    
    //WORKS FOR NOW , REFRESH FOR REAL GAMERESET AT THE MOMENT THIS IS JUST RESETTING FRONT END VISUALLY
  }



   startBoggle.click(function(){
    totalCurrentScore = 0
    updateScoreFrontEnd()
    $.ajax({
        type: "POST",
        url: "/play_boggle",
        success: function(response){
            gameContainer.empty();
            const board = response.board;
            let html = '<table>';
            $.each(board,function(rowidx,row){
                html += '<tr>';
                $.each(row,function(cellidx,cell){
                    html += '<td>' + cell + '</td>';
                });
                html += '</tr>'
            });
            html += '</table>'
            gameContainer.html(html)
            userWordForm.show();
            gameContainer.show()
            timerContainer.show()  //meant to show timer as the game is activated but doesnt do anything atm, make this the way the timer is displayed(this is for hiding if it worked in resetGame)
            scoreContainer.show()
            startTimer(); //CALL BACK
            
        },
        error: function(xhr,status,error){
            console.error("error displaying board/game",error);
        }
    });
   });
   

   userWordForm.submit(function(event){
      event.preventDefault();
      const word = wordInput.val();
      $.ajax({
        type: 'POST',
        url: '/verify_word',
        contentType: 'application/json',
        data: JSON.stringify({word:word}),
        success: function(response){
            resultMessage.text('result' + response.result);
            if(response.result === "ok"){
                const wordScore = word.length
                totalCurrentScore += wordScore
                //totalCurrentScore++
                updateScoreFrontEnd()
                //updateScoreOnServer()
                //console.log(totalCurrentScore,response)
            }
        },
        error: function(xhr,status,error){
            console.error("error with user submitting word form",error);
            console.log(status,xhr)
        }
      });
   });

//function updateScoreOnServer(score){
//    $.ajax({
//        type: "POST",
//        url: '/boggle_score_data',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            timesPlayed: timesPlayed,
//            highestScore: highestScore,
//            totalCurrentScore: score
//        }),
//        success: function(response){
//            console.log("score on server",response)
//        }
//    })
//}





});