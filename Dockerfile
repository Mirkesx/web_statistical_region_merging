FROM nikolaik/python-nodejs:python3.6-nodejs12

WORKDIR /usr/src/app
COPY . .
RUN apt update \
    && apt -y upgrade \
    && apt install -y libgl1-mesa-glx
#     && apt install -y python-pip
# RUN apt -y install software-properties-common
# RUN add-apt-repository -y ppa:deadsnakes/ppa \
#     && apt update
# RUN apt -y install python3.8
# RUN apt -y install pip
# RUN pip install --upgrade setuptools
RUN pip install --no-input numpy opencv-python
RUN npm install
RUN ls
EXPOSE 8080
CMD [ "node", "main.js" ]