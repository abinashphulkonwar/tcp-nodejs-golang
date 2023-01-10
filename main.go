package main

import (
	"net"
)

func handleRequest(connection net.Conn) {
	connection.Write([]byte(connection.LocalAddr().Network() + connection.LocalAddr().String()))
	print(connection.RemoteAddr().Network() + connection.RemoteAddr().String())
	buff := make([]byte, 1024)

	data, err := connection.Read(buff)
	if err != nil {
		println("Error reading:", err.Error())

	}
	msg := string(buff[:data])
	println(msg)

}

func main() {

	addr, err := net.ResolveTCPAddr("tcp", ":8080")
	if err != nil {
		panic(err)
	}

	server, err := net.ListenTCP("tcp", addr)
	if err != nil {
		println("Error listening:", err.Error())
	}
	for {
		connection, err := server.AcceptTCP()
		if err != nil {
			println("Error accepting: ", err.Error())
		}

		go handleRequest(connection)

	}
}
