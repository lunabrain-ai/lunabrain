FROM python:3.8

ENV PROJECT_DIR /usr/local/src/webapp

WORKDIR ${PROJECT_DIR}

COPY requirements.txt ${PROJECT_DIR}/

RUN pip install -r requirements.txt

COPY . ${PROJECT_DIR}

EXPOSE 50051

CMD ["python", "server.py"]
