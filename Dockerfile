FROM node:10.15.0

WORKDIR /usr/src/oye-rickshaw

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]