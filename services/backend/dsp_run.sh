#!/bin/bash

cd src
python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
#gunicorn -b 0.0.0.0:8000 dsp.wsgi
#daphne -b 0.0.0.0 -p 8000 dsp.asgi:application
python3 manage.py runserver 0.0.0.0:8000
