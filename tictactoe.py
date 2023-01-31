## Board functions ##
boardLegend = {
    "1" : "1", "2" : "2", "3" : "3",
    "4" : "4", "5" : "5", "6" : "6",
    "7" : "7", "8" : "8", "9" : "9"
}

defaultBoard = {
    "1" : " ", "2" : " ", "3" : " ",
    "4" : " ", "5" : " ", "6" : " ",
    "7" : " ", "8" : " ", "9" : " "
}

def printBoard(board):
    print()
    print(board["1"] + "|" + board["2"] + "|" + board["3"])
    print("-+-+-")
    print(board["4"] + "|" + board["5"] + "|" + board["6"])
    print("-+-+-")
    print(board["7"] + "|" + board["8"] + "|" + board["9"])
    print()


## Main Game Functions ##

# Play the main game
def playGame(p1, p2):

    # Players take turns to play
    activeBoard = dict(defaultBoard)
    turn = 1
    print("Board legend: ")
    printBoard(boardLegend)
    printBoard(activeBoard)
    while (turn < 10):

        #p1 plays on odd turns
        if (turn % 2 != 0):
            playerTurn(activeBoard, p1, "X") 
            space = checkForWinner(activeBoard, turn)
            if (space != -1):
                return p1
        #p2 plays on even turns
        else:
            playerTurn(activeBoard, p2, "O")
            space = checkForWinner(activeBoard, turn)
            if (space != -1):
                return p2

        turn += 1
    
    # Case of no winner
    return "none"

# Print the winner of the game
def printWinner(p):
    if (p == "none"):
        print("It's a draw! Nobody won this round of tic-tac-toe.")
    else:
        print("Congratulations " + p + ", you won this game!")

#See if player wants to play again
def playAgain():
    print("Would you like to play again? (yes/no)")
    answer = input()
    if (answer == "yes"):
        print("\nOk! Restarting game...\n")
        main()
    elif (answer == "no"):
        print("\nOk, thanks for playing!\n")
    else:
        print("\nInvalid input. You must type either \"yes\" or \"no\".\n")
        playAgain()


## Helper functions ##

def playerTurn(board, p, mark):
    print("It's " + p + "'s turn. Choose a space (1-9) to occupy on the board: ")
    chooseSpace(board, p, mark)
    printBoard(board)

def chooseSpace(board, p, mark):
    text = "\n" + p + ", choose an empty space from 1-9 inclusive.\n(Type \"peek\" to see the board)"
    a = input()
    if a == "peek":
        printBoard(board)
        print(text)
        chooseSpace(board, p, mark)
    elif (a in board):
        if board[a] ==  ' ': board[a] = mark
        else:
            print("\nSpace already taken. " + text)
            chooseSpace(board, p, mark)
    else:
        print("\nInvalid space entered. " + text)
        chooseSpace(board, p, mark)

def checkForWinner(board, turn):
    space = -1
    if (turn > 2):
        if ((board["1"] == board["5"] == board["9"]) or
        (board["3"] == board["5"] == board["7"]) or
        (board["4"] == board["5"] == board["6"]) or
        (board["2"] == board["5"] == board["8"])) and (board["5"] != ' '):
            space = 5
        elif ((board["1"] == board["4"] == board["7"]) or
        (board["1"] == board["2"] == board["3"])) and (board["1"] != ' '):
            space = 1
        elif ((board["3"] == board["6"] == board["9"]) or
        (board["7"] == board["8"] == board["9"])) and (board["9"] != ' '):
            space = 9
    # If no current winner, return -1
    return space


## Main Script ##

def main():
    print("This is a 2-player tic-tac-toe game.")

    # Get player names
    print("Enter the name of player 1:")
    p1 = input()
    print("\nEnter the name of player 2:")
    p2 = input()
    print("\n" + p1 + " will be \"X\" and " + p2 + " will be \"O\"\n")

    winner = playGame(p1, p2)
    printWinner(winner)
    playAgain()


## Run main script ##
main()