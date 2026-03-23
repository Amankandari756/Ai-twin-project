#!/usr/bin/env python3
"""
Startup script for AI Twin of Germany Backend
Created by AMAN SINGH KANDARI
"""

import subprocess
import sys
import os

def main():
    """Start the FastAPI backend server"""
    print("🚀 Starting AI Twin of Germany Backend...")
    print("Created by AMAN SINGH KANDARI\n")
    
    # Check if we're in the right directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    if not os.path.exists(backend_dir):
        print(" Error: backend directory not found!")
        sys.exit(1)
    
    # Install dependencies if needed
    print(" Checking dependencies...")
    try:
        subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '-q', '-r', 'requirements.txt'],
            cwd=backend_dir,
            check=True
        )
        print(" Dependencies ready\n")
    except subprocess.CalledProcessError:
        print("  Warning: Could not install dependencies automatically")
        print("   Please run: pip install -r backend/requirements.txt\n")
    
    # Start the server
    print(" Starting FastAPI server on http://localhost:8000")
    print(" API Documentation: http://localhost:8000/docs")
    print(" Alternative Docs: http://localhost:8000/redoc\n")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        subprocess.run(
            [sys.executable, 'main.py'],
            cwd=backend_dir
        )
    except KeyboardInterrupt:
        print("\n Server stopped. Goodbye!")

if __name__ == '__main__':
    main()
