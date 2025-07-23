# Loops and Conditions in ThoughtScript
# Demonstrating natural flow control

express "Counting from 1 to 10 and categorizing numbers:"

consider number from 1 to 10:
    if isEven(number):
        remember number as "even"
        express number + " is even"
    otherwise:
        remember number as "odd"
        express number + " is odd"

express ""
express "Let's see what we remembered:"
show memories

express ""
express "Thinking about some special numbers:"

consider value from 1 to 5:
    if value is 1:
        express "One is the loneliest number"
    otherwise:
        if value is 3:
            express "Three is a magic number"
        otherwise:
            if value is 5:
                express "Five is alive!"
            otherwise:
                express value + " is just a regular number"