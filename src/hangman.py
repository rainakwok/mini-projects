import sys

def hangman(phrase):

    # variables
    board = []
    correctL = []
    incorrectL = []
    mistakes = 0

    # Create a list of letters in the word
    letters = list(phrase)

    # Print board of underscores for each letter
    words = phrase.split()
    count = 1
    for w in words:
        for ltr in w:
            # print/show alphabetical characters as blanks
            if (ltr.isalpha()):
                board += ["_"]
            # print/show non-alphabetical characters
            else:
                board += [ltr]
        
        # Add a space between each word
        index = words.index(w)
        if (count < len(words)):
            board += [" "]
            count += 1
    
    print("Board: " + " ".join(board) + "\n")

    # Draw hangman
    drawHangman(mistakes)

    # Repeat until word is guessed or hangman is complete
    while (mistakes < 6):

        # Ask user to guess a letter
        print("Guess a letter or the entire phrase: ", end="")
        guess = input().lower().strip()

        # Ensure valid input (alphabetical string, new letter is guessed, and either 1 letter or same length as phrase)
        while ((len(guess) == 1 and not guess.isalpha())
               or (guess in correctL or guess in incorrectL)
               or ((len(guess) != 1) and (len(guess) != len(phrase)))):
            # Inform player of invalid input. Let host input another phrase or end the game
            print("Invalid input.")
            print("Please enter a new, alphabetical letter or guess the exact phrase (include punctuation): ",
                  end="")
            guess = input().lower().strip()

        # If user guessed the exact phrase (instead of a letter), break out of loop
        if (guess == phrase):
            correctL.append(guess)
            for k in range(len(phrase)):
                board[k] = phrase[k]
            
            # Print hangman, guesses, and board
            drawHangman(mistakes)
            printGuesses(correctL, incorrectL)
            print("Board: " + " ".join(board) + "\n")
            print("\nSensational!")
            break

        # Replace underscore with letter if user guesses a letter correctly
        if (guess in letters):
            for j in range(len(letters)):
                if (letters[j] == guess):
                    board[j] = letters[j]
            correctL.append(guess)
            print("\n\n\n\nGreat guess! The letter \'" + guess + "\' exists in the mystery word or phrase.")
        # Otherwise, 'draw a part of the hangman' if user guesses incorrectly
        else:
            incorrectL.append(guess)
            mistakes += 1
            print("\nUnfortunately, the letter \'" + guess + "\' does not exist in the mystery word or phrase.")
        
        # Print hangman, guesses, and board
        drawHangman(mistakes)
        printGuesses(correctL, incorrectL)
        print("Board: " + " ".join(board) + "\n")

        # End loop if phrase has been guessed
        if (board.count("_") == 0):
            break

    # Print win/lose message
    if (mistakes < 6):
        print("Congratulations on guessing the mystery word or phrase \"" + phrase + "\" with less than 6 mistakes. You win!\n")
    else:
        print("You made 6 mistakes. You lose :(")
        print("The mystery word or phrase was \"" + phrase + "\"\n")


# Print the correct and incorrect guesses
def printGuesses(correct, incorrect):
    print("Correct guesses: ", end = "")
    if (len(correct) > 0):
        print(correct)
    else:
        print("")
    print("Incorrect guesses: ", end = "")
    if (len(incorrect) > 0):
        print(incorrect)
    else:
        print("")

# Print a drawing of the hangman
def drawHangman(stage):
    stand = "|\n"
    emptyTop = "______\n|    |\n|    A"
    head  = "| (x - x)"
    neck = "|    |"
    arm1 = "| \__|"
    arm2 = "| \__|__/\n|    |"
    leg1 = "|   /\n| _/"
    leg2 = "|   / \\\n| _/   \\_"

    print(emptyTop)
    if (stage != 0):
        print(head)
        if (stage == 2):
            print(neck)
        elif (stage == 3):
            print(arm1)
        elif (stage > 3):
            print(arm2)
            if (stage == 5):
                print(leg1)
            elif (stage == 6):
                print(leg2)
    
    print(stand * (5 - stage))

    # ______
    # |    |
    # |    ^
    # | (x - x)
    # | \__|__/
    # |   / \
    # | _/   \_
    # |

## Play hangman ##

# Intro
print("\nLet's play Hangman!\n")
print("The goal of the game is to guess the word or phrase correctly. You can only guess one letter each time.")
print("If you make more than 6 mistakes, it's game over!\nReady?\n")
print("All players, cover your eyes.\nHost, please type in your secret word or phrase: ", end="")
phrase = input()

# Check for valid input.
while (len(phrase) == 0 or (phrase.count("_") != 0)):
    # Inform host of invalid input. Let host input another phrase or end the game
    print("\nInvalid input entered. Host, please type in a word or phrase that doesn't contain the character \"_\",\nor type \"STOP!\" to stop the game: ", end="")
    phrase = input()

    # If host types "STOP!", stop the game
    if (phrase == "STOP!"):
        sys.exit("\nHangman game stopped.\n")

# Trim any leading or trailing whitespaces
phrase = phrase.strip().lower()

# Start game!
print("\n\n\n\n\n\n\n\n\n\n")
print("All players, open your eyes. Can you guess the word or phrase before the hangman has been fully drawn?\n")
hangman(phrase)
