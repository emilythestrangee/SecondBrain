#!/bin/bash

# SecondBrain Flutter Development Script

echo "🧠 SecondBrain Flutter Development Helper"
echo "========================================"

case "$1" in
  "setup")
    echo "📦 Setting up project..."
    flutter pub get
    echo "🔧 Generating code..."
    dart run build_runner build --delete-conflicting-outputs
    echo "✅ Setup complete!"
    ;;
  "test")
    echo "🧪 Running tests..."
    flutter test
    ;;
  "build")
    echo "🏗️ Building app..."
    flutter build apk --release
    ;;
  "run")
    echo "🚀 Running app..."
    flutter run
    ;;
  "clean")
    echo "🧹 Cleaning project..."
    flutter clean
    flutter pub get
    dart run build_runner build --delete-conflicting-outputs
    echo "✅ Clean complete!"
    ;;
  "format")
    echo "🎨 Formatting code..."
    dart format .
    ;;
  "analyze")
    echo "🔍 Analyzing code..."
    flutter analyze
    ;;
  *)
    echo "Usage: $0 {setup|test|build|run|clean|format|analyze}"
    echo ""
    echo "Commands:"
    echo "  setup   - Install dependencies and generate code"
    echo "  test    - Run all tests"
    echo "  build   - Build release APK"
    echo "  run     - Run the app"
    echo "  clean   - Clean and rebuild project"
    echo "  format  - Format code"
    echo "  analyze - Analyze code for issues"
    ;;
esac
