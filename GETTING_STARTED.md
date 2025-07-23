# 🚀 ThoughtScript - Simple Getting Started Guide

## What is ThoughtScript?
ThoughtScript is a programming language that lets you write code using **natural language**. Instead of complex syntax, you can literally "think" your way through programming!

Example:
```thoughtscript
think "Hello World" as greeting
express greeting
```

## 📋 Quick Start Workflow (5 minutes)

### Step 1: Check if Everything is Ready
```bash
# Make sure you're in the right directory
pwd
# Should show: /workspace

# Check if files exist
ls -la
# You should see: src/, public/, package.json, etc.
```

### Step 2: Try Your First ThoughtScript Program
```bash
# Run a simple example
node src/index.js examples/hello-world.ts
```

**What you'll see:**
```
Hello, World!
Welcome to ThoughtScript!
Programming with natural thoughts!
Hello, developer!
```

### Step 3: Try the Interactive Web IDE (Recommended for Beginners)
```bash
# Start the web server
npm start
```

Then open your web browser and go to: **http://localhost:3000**

**What you'll see:**
- A beautiful code editor on the left
- An output console on the right  
- Example programs you can try
- Documentation built-in

### Step 4: Write Your First Program in the Web IDE

1. **Clear the editor** (click the eraser icon)
2. **Type this simple program:**
```thoughtscript
think "My name is [YOUR NAME]" as introduction
express introduction

think 25 as myAge
if myAge > 18:
    express "I am an adult"
otherwise:
    express "I am young"
```

3. **Click the "Run" button** (or press Ctrl+Enter)
4. **See the output** in the console below!

## 🎯 More Examples to Try

### Example 1: Simple Math
```thoughtscript
think 10 as firstNumber
think 20 as secondNumber
express "The sum is: " + add(firstNumber, secondNumber)
express "The difference is: " + subtract(secondNumber, firstNumber)
```

### Example 2: Working with Text
```thoughtscript
think "thoughtscript" as language
express "Original: " + language
express "Uppercase: " + uppercase(language)
express "Length: " + length(language)
```

### Example 3: Loops and Memory
```thoughtscript
consider number from 1 to 5:
    if isEven(number):
        remember number as "even"
    otherwise:
        remember number as "odd"

show memories
```

## 🎮 Interactive Learning Path

### Beginner (Start Here!)
1. ✅ **Web IDE** - Use the browser interface
2. ✅ **Try Examples** - Click "Examples" button in the web IDE
3. ✅ **Modify Examples** - Change numbers, text, etc.

### Intermediate  
1. **Command Line** - Try: `node src/index.js examples/hello-world.ts`
2. **REPL** - Try: `npm run repl` (type `.help` for commands)
3. **Create Files** - Make your own `.ts` files with ThoughtScript

### Advanced
1. **Run Tests** - `npm test` to see how it works
2. **Explore Code** - Look in `src/` folder
3. **Add Features** - Extend the language!

## 🔧 Troubleshooting

### Problem: "npm start" doesn't work
**Solution:**
```bash
# Install dependencies first
npm install
# Then try again
npm start
```

### Problem: Can't access http://localhost:3000
**Solution:**
```bash
# Check if server is running
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Problem: "Command not found"
**Solution:**
```bash
# Make sure you're in the right directory
cd /workspace
# Check if package.json exists
ls package.json
```

## 🎯 Simple 3-Step Workflow

### For Complete Beginners:

#### Step 1: Start the Web IDE
```bash
npm start
```

#### Step 2: Open Browser
Go to: **http://localhost:3000**

#### Step 3: Try This Code
Copy and paste this into the editor:
```thoughtscript
think "I'm learning ThoughtScript!" as message
express message

consider number from 1 to 3:
    express "Counting: " + number

remember "ThoughtScript is cool!" as "my opinion"
show memories
```

Click **"Run"** and see the magic! ✨

## 📚 What Each Command Does

| Command | What it does | When to use |
|---------|-------------|-------------|
| `npm start` | Starts web IDE | **Best for beginners** - easiest to use |
| `npm run repl` | Opens interactive terminal | When you want to type commands one by one |
| `node src/index.js file.ts` | Runs a file | When you have a saved program |
| `npm test` | Runs tests | To check everything works |

## 🎉 You're Ready!

**Congratulations!** You now know how to:
- ✅ Start ThoughtScript
- ✅ Write your first program  
- ✅ Use the web IDE
- ✅ Run examples
- ✅ Troubleshoot issues

**Next Steps:**
1. Try all the examples in the web IDE
2. Modify them to do different things
3. Create your own programs
4. Share your creations!

**Need Help?** 
- Click "Docs" in the web IDE for language reference
- Click "Examples" for more program ideas
- Look at files in the `examples/` folder

**Happy thinking!** 🧠✨