FROM nikolaik/python-nodejs:python3.6-nodejs12

WORKDIR /usr/src/app
COPY . .
RUN apt update \
    && apt -y upgrade \
    && apt install -y libgl1-mesa-glx
RUN pip install --no-input numpy opencv-python
RUN npm install
EXPOSE 8080
CMD [ "node", "main.js" ]