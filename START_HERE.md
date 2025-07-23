# 🚀 START HERE - ThoughtScript in 30 Seconds

## What is ThoughtScript?
A programming language where you write code like natural thoughts!

```thoughtscript
think "Hello World" as greeting
express greeting
```

## Super Quick Start (Choose ONE)

### Option 1: Automated Script (Easiest)
```bash
./quick-start.sh
```
**What it does:** Guides you through everything step-by-step with a menu.

### Option 2: Web IDE (Visual)
```bash
npm start
```
Then open: **http://localhost:3000**

**What you get:** Beautiful code editor in your browser with examples.

### Option 3: Command Line (Simple)
```bash
node src/index.js examples/beginner-tutorial.ts
```
**What it does:** Runs a complete tutorial showing all features.

### Option 4: Interactive Terminal
```bash
npm run repl
```
**What it does:** Type commands one at a time and see results immediately.

## Which Should I Choose?

| If you are... | Use... | Why |
|---------------|--------|-----|
| **Complete beginner** | `./quick-start.sh` | It guides you through everything |
| **Like visual interfaces** | `npm start` | Beautiful web editor |
| **Want to see examples fast** | `node src/index.js examples/beginner-tutorial.ts` | See everything at once |
| **Prefer typing commands** | `npm run repl` | Interactive experience |

## Help! Something's Wrong?

### If commands don't work:
```bash
npm install
```

### If you need help:
```bash
./quick-start.sh
# Choose option 5 for documentation
```

### If you're lost:
1. Try the automated script: `./quick-start.sh`
2. Choose option 1 (Web IDE)
3. Click "Examples" in the web interface
4. Try modifying the examples

## Example Programs You Can Try

### Hello World
```thoughtscript
think "Hello, ThoughtScript!" as message
express message
```

### Simple Math
```thoughtscript
think 10 as x
think 5 as y
express "Sum: " + add(x, y)
```

### Loops
```thoughtscript
consider number from 1 to 5:
    express "Number: " + number
```

### Memory
```thoughtscript
remember "cookies" as "favorite snack"
show memories
```

## That's It!

**You're ready to start!** Pick one of the 4 options above and begin your ThoughtScript journey.

**Most recommended for beginners:** `./quick-start.sh`

Need more detailed help? See `GETTING_STARTED.md`