#!/usr/local/bin/python
import os

os.system('OPENAI_API_KEY=$(aws secretsmanager get-secret-value --secret-id lunasec-OpenAISecret | jq -r .SecretString) watchmedo auto-restart --recursive --pattern="*.py" python server.py')
