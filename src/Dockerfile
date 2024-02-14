FROM ubuntu:20.04

RUN apt update -y && apt upgrade -y && \
    apt-get install -y python3-pip && \
    apt-get install -y gcc 

# Needed to skip interactive pytz installation
RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

RUN apt-get -y update && apt-get install -y --no-install-recommends \
    wget \
    nginx \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Symlink python3.8 to python
RUN ln -s /usr/bin/python3.8 /usr/bin/python

RUN pip install Pillow


# Set some environment variables. PYTHONUNBUFFERED keeps Python from buffering our standard
# output stream, which means that logs can be delivered to the user quickly. PYTHONDONTWRITEBYTECODE
# keeps Python from writing the .pyc files which are unnecessary in this case. We also update
# PATH so that the train and serve programs are found when the container is invoked.

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/program:${PATH}"

WORKDIR /opt/program

COPY ./requirements.txt /opt/program/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /opt/program/requirements.txt
COPY /src /opt/program/src/

RUN chmod +x /opt/program/src/serve_app.py

ENTRYPOINT ["python", "/opt/program/src/serve_app.py"]