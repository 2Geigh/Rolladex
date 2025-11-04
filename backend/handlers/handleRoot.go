package handlers

import "net/http"

func HandleRoot(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
	} else {
		w.Write([]byte("You just recieved a POST request!"))
	}

	http.ServeFile(w, req, "./views/index.html")
}
