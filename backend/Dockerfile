# Use a lightweight Debian image for the final stage
FROM golang
WORKDIR /app

RUN apt update
RUN apt upgrade
RUN apt install sqlite3
RUN apt install make

COPY . .
# xterm is the required TERM (terminal emulation environment variable) 
# value needed for make to run
# xterm is commonly used for Linux-based terminal emulators 
ENV TERM xterm
RUN make

# Create a directory for the SQLite file
RUN mkdir -p /app/data

EXPOSE 3001
CMD ["./bin/main.out"]