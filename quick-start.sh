#!/bin/bash

# ThoughtScript Quick Start Script
# This script helps you get started with ThoughtScript in 3 simple steps

echo "🧠 Welcome to ThoughtScript Quick Start!"
echo "======================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for user input
wait_for_user() {
    echo ""
    read -p "Press Enter to continue..." -r
    echo ""
}

# Step 1: Check Prerequisites
echo "Step 1: Checking if everything is ready..."
echo "----------------------------------------"

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ Not in ThoughtScript directory. Please run from the project root."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo "✅ ThoughtScript project found"
echo "✅ All prerequisites met!"

wait_for_user

# Step 2: Install Dependencies (if needed)
echo "Step 2: Installing dependencies..."
echo "--------------------------------"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm packages..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed!"
fi

wait_for_user

# Step 3: Run Your First Program
echo "Step 3: Running your first ThoughtScript program..."
echo "------------------------------------------------"

echo "🚀 Executing: examples/hello-world.ts"
echo ""
echo "--- OUTPUT ---"
node src/index.js examples/hello-world.ts
echo "--- END OUTPUT ---"
echo ""
echo "✅ Your first ThoughtScript program ran successfully!"

wait_for_user

# Step 4: Show Available Options
echo "Step 4: What's next?"
echo "-------------------"
echo ""
echo "Choose what you'd like to try next:"
echo ""
echo "1) 🌐 Start Web IDE (recommended for beginners)"
echo "2) 💻 Try Interactive REPL"
echo "3) 📝 Run another example"
echo "4) 🧪 Run tests"
echo "5) 📚 View documentation"
echo "6) ❌ Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting Web IDE..."
        echo "====================="
        echo ""
        echo "The web server will start in a moment."
        echo "Once it's running, open your browser and go to:"
        echo ""
        echo "    👉 http://localhost:3000"
        echo ""
        echo "You'll see a beautiful code editor where you can:"
        echo "- Write ThoughtScript programs"
        echo "- Try built-in examples"
        echo "- See output in real-time"
        echo "- Access documentation"
        echo ""
        echo "Press Ctrl+C to stop the server when you're done."
        echo ""
        read -p "Press Enter to start the web server..." -r
        npm start
        ;;
    2)
        echo ""
        echo "💻 Starting Interactive REPL..."
        echo "==============================="
        echo ""
        echo "You're about to enter the ThoughtScript REPL (Read-Eval-Print Loop)."
        echo "Here you can type ThoughtScript commands and see results immediately."
        echo ""
        echo "Try these commands:"
        echo '  think "Hello REPL" as greeting'
        echo '  express greeting'
        echo '  .help    (for more commands)'
        echo '  .exit    (to quit)'
        echo ""
        read -p "Press Enter to start the REPL..." -r
        npm run repl
        ;;
    3)
        echo ""
        echo "📝 Available Examples:"
        echo "====================="
        echo ""
        if [ -d "examples" ]; then
            ls -1 examples/*.ts | while read file; do
                echo "  📄 $file"
            done
            echo ""
            echo "Try running: node src/index.js examples/loops-and-conditions.ts"
        else
            echo "No examples directory found."
        fi
        ;;
    4)
        echo ""
        echo "🧪 Running Tests..."
        echo "=================="
        echo ""
        npm test
        ;;
    5)
        echo ""
        echo "📚 Documentation Available:"
        echo "==========================="
        echo ""
        echo "📖 Getting Started Guide: GETTING_STARTED.md"
        echo "📋 Feature Overview: FEATURES.md"
        echo "📘 Main Documentation: README.md"
        echo ""
        if command_exists cat; then
            echo "Would you like to view the Getting Started guide now? (y/n)"
            read -p "> " view_docs
            if [[ $view_docs =~ ^[Yy]$ ]]; then
                echo ""
                echo "📖 GETTING STARTED GUIDE:"
                echo "========================="
                cat GETTING_STARTED.md | head -50
                echo ""
                echo "(Showing first 50 lines - see GETTING_STARTED.md for complete guide)"
            fi
        fi
        ;;
    6)
        echo ""
        echo "👋 Thank you for trying ThoughtScript!"
        echo ""
        echo "Remember, you can always:"
        echo "- Run this script again: ./quick-start.sh"
        echo "- Start the web IDE: npm start"
        echo "- Use the REPL: npm run repl"
        echo "- Read the docs: GETTING_STARTED.md"
        echo ""
        echo "Happy thinking! 🧠✨"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again and choose 1-6."
        exit 1
        ;;
esac

echo ""
echo "🎉 Quick start completed!"
echo ""
echo "To run this script again: ./quick-start.sh"
echo "For more help, see: GETTING_STARTED.md"
echo ""