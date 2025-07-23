# ThoughtScript Beginner Tutorial
# Learn ThoughtScript step by step!

# ===================
# 1. BASIC THINKING
# ===================
express "=== Welcome to ThoughtScript Tutorial ==="

# In ThoughtScript, we 'think' to create variables
think "Alice" as name
think 25 as age
think true as isStudent

# We 'express' to show our thoughts
express "Hello, my name is " + name
express "I am " + age + " years old"

# ===================
# 2. SIMPLE MATH
# ===================
express ""
express "=== Let's do some math ==="

think 10 as firstNumber
think 5 as secondNumber

express "First number: " + firstNumber
express "Second number: " + secondNumber
express "Sum: " + add(firstNumber, secondNumber)
express "Difference: " + subtract(firstNumber, secondNumber)
express "Product: " + multiply(firstNumber, secondNumber)
express "Division: " + divide(firstNumber, secondNumber)

# ===================
# 3. MAKING DECISIONS
# ===================
express ""
express "=== Making decisions ==="

if age > 18:
    express name + " is an adult"
otherwise:
    express name + " is a minor"

if isStudent:
    express name + " is currently studying"
otherwise:
    express name + " is not a student"

# ===================
# 4. COUNTING AND LOOPS
# ===================
express ""
express "=== Let's count together ==="

consider number from 1 to 5:
    express "Counting: " + number

express ""
express "=== Even and odd numbers from 1 to 10 ==="

consider num from 1 to 10:
    if isEven(num):
        express num + " is even"
    otherwise:
        express num + " is odd"

# ===================
# 5. REMEMBERING THINGS
# ===================
express ""
express "=== Using memory to remember things ==="

remember "chocolate" as "favorite food"
remember "blue" as "favorite color"
remember 42 as "lucky number"

express "I've remembered some things..."
show memories

# ===================
# 6. WORKING WITH TEXT
# ===================
express ""
express "=== Playing with text ==="

think "thoughtscript" as language
express "Language: " + language
express "Uppercase: " + uppercase(language)
express "Length: " + length(language)
express "Type: " + type(language)

# ===================
# 7. MORE ADVANCED THINKING
# ===================
express ""
express "=== More advanced examples ==="

consider i from 1 to 5:
    if i is 1:
        remember "first" as "position " + i
    otherwise:
        if i is 5:
            remember "last" as "position " + i
        otherwise:
            remember "middle" as "position " + i

express "Final memories:"
show memories

# ===================
# CONGRATULATIONS!
# ===================
express ""
express "=== Congratulations! ==="
express "You've completed the ThoughtScript tutorial!"
express "You now know how to:"
express "  ✓ Think (create variables)"
express "  ✓ Express (show output)"
express "  ✓ Consider (create loops)"
express "  ✓ Make decisions (if/otherwise)"
express "  ✓ Remember things (memory)"
express "  ✓ Use built-in functions"
express ""
express "Try creating your own programs now!"
express "Happy thinking! 🧠✨"