FROM python:3.12.4-alpine3.20
WORKDIR /app

COPY . .

RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev

RUN pip install --no-cache-dir --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

RUN chmod +x ./dockerCmd.sh
CMD /app/dockerCmd.sh
# CMD ["sleep", "infinity"]
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]