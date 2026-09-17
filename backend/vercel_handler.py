import os
import sys

# Ensure both root directory and backend directory are in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = current_dir

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.app import app

# Backend WSGI / Python Serverless application reference
# 'app' is the Flask application instance
