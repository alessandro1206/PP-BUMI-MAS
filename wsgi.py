import sys
import os

# Add your project directory to the sys.path
project_home = '/home/USERNAME/pp_bumi_mas' # Replace USERNAME with your PythonAnywhere username
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from app import app as application
