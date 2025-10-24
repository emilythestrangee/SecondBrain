@echo off
REM SecondBrain Flutter Development Script for Windows

echo 🧠 SecondBrain Flutter Development Helper
echo ========================================

if "%1"=="setup" (
    echo 📦 Setting up project...
    flutter pub get
    echo 🔧 Generating code...
    dart run build_runner build --delete-conflicting-outputs
    echo ✅ Setup complete!
) else if "%1"=="test" (
    echo 🧪 Running tests...
    flutter test
) else if "%1"=="build" (
    echo 🏗️ Building app...
    flutter build apk --release
) else if "%1"=="run" (
    echo 🚀 Running app...
    flutter run
) else if "%1"=="clean" (
    echo 🧹 Cleaning project...
    flutter clean
    flutter pub get
    dart run build_runner build --delete-conflicting-outputs
    echo ✅ Clean complete!
) else if "%1"=="format" (
    echo 🎨 Formatting code...
    dart format .
) else if "%1"=="analyze" (
    echo 🔍 Analyzing code...
    flutter analyze
) else (
    echo Usage: %0 {setup^|test^|build^|run^|clean^|format^|analyze}
    echo.
    echo Commands:
    echo   setup   - Install dependencies and generate code
    echo   test    - Run all tests
    echo   build   - Build release APK
    echo   run     - Run the app
    echo   clean   - Clean and rebuild project
    echo   format  - Format code
    echo   analyze - Analyze code for issues
)
