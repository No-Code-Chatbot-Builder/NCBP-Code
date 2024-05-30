FROM python:3.12

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

ENV PORT=80

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]