FROM python:3.9-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ARG GID=1000
ARG UID=1000
ARG DOCKER_LOGIN=appuser

RUN groupadd --gid ${GID} ${DOCKER_LOGIN} \
    && useradd --uid ${UID} --gid ${DOCKER_LOGIN} --shell /bin/bash --create-home ${DOCKER_LOGIN}

USER ${DOCKER_LOGIN}

WORKDIR /app/backend

COPY ./dsp ./dsp
COPY ./manage.py ./
COPY ./dsp_run.sh ./

COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt

CMD ["./dsp_run.sh"]
