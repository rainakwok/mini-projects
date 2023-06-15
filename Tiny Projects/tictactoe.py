
### Main Script ###

def main():
    
    print("This is a 2-player tic-tac-toe game.")

    # Get player names
    print("Enter the name of player 1:")
    p1 = input()
    print("\nEnter the name of player 2:")
    p2 = input()
    print("\n" + p1 + " will be \"X\" and " + p2 + " will be \"O\"\n")

    # Find and print winner
    winner = playGame(p1, p2)
    printWinner(winner)

    # Ask if players want to play again
    playAgain()


### Board vars/functions ###

# 1 | 2 | 3 
# --+---+--
# 4 | 5 | 6
# --+---+--
# 7 | 8 | 9

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


### Main Functions ###

## Play the game ##
def playGame(p1, p2):

    # Set up game
    activeBoard = dict(defaultBoard)
    print("Board legend: ")
    printBoard(boardLegend)
    print("Current Board: ")
    printBoard(activeBoard)

    player1 = [p1, "X"]
    player2 = [p2, "O"]
    turn = 1

    while (turn < 10):

        #p1 plays on odd turns
        if (turn % 2 != 0):
            playerTurn(activeBoard, player1) 
            space = checkForWinner(activeBoard, turn)
            if (space != -1):
                return player1[0]
        #p2 plays on even turns
        else:
            playerTurn(activeBoard, player2)
            space = checkForWinner(activeBoard, turn)
            if (space != -1):
                return player2[0]

        turn += 1
    
    # Case of no winner
    return "none"

## Print the winner of the game
def printWinner(p):
    if (p == "none"):
        print("It's a draw! Nobody won this round of tic-tac-toe.")
    else:
        print("Congratulations " + p + ", you won this game!")

## Ask if player wants to play again
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


### Helper functions ###

## Player's turn to put X or O on the board
def playerTurn(board, player):
    print("It's " + player[0] + "'s turn. Choose a space (1-9) to occupy on the board: ")
    chooseSpace(board, player)
    printBoard(board)

## Player chooses a space on the board
def chooseSpace(board, player):
    text = "\n" + player[0] + ", choose an empty space from 1-9 inclusive.\n(Type \"peek\" to see the board)"
    a = input()
    if a == "peek":
        printBoard(board)
        print(text)
        chooseSpace(board, player)
    elif (a in board):
        if board[a] ==  ' ': board[a] = player[1]
        else:
            print("\nSpace already taken. " + text)
            chooseSpace(board, player)
    else:
        print("\nInvalid space entered. " + text)
        chooseSpace(board, player)

## Check for winner
def checkForWinner(board, turn):
    space = -1
    if (turn > 2):
        if ((board["5"] != ' ') and
        ((board["1"] == board["5"] == board["9"]) or (board["3"] == board["5"] == board["7"]) or
        (board["4"] == board["5"] == board["6"]) or (board["2"] == board["5"] == board["8"]))):
            space = 5
        elif ((board["1"] != ' ') and 
        ((board["1"] == board["4"] == board["7"]) or (board["1"] == board["2"] == board["3"]))):
            space = 1
        elif ((board["9"] != ' ') and
        ((board["3"] == board["6"] == board["9"]) or (board["7"] == board["8"] == board["9"]))):
            space = 9
    # If no winner (yet), return -1
    return space


### Run main script ###
if __name__ == "__main__":
    main()