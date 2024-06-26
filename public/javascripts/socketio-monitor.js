$(function () {
    var incoming = 0; //incoming counter
    $("#incoming").val(incoming)

    $("#socketStatus").html("<p class='red'> configure the server and press listen!</p>")

    function nowTimestamp() {
        return (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' | ';
    }
    var socket;
    //listenToSocket($("#server").val());

    function listenToSocket(s) {
      //socket = io($("#server").val());
    //  console.log( $("#socketQuery").val());
    //  console.log( $("#socketQueryValue").val());

      //socket = io($("#server").val(),{query:{"aa":"bb"}})
      socket = io($("#server").val(), { query: { "userId": $("#socketQueryValue").val() } }); //socket.connect();

      //console.log(socket.query)

        socket.on('connect', () => {
            //console.log(socket)
            $("#logs").prepend("<p class='logsGreen'>" + nowTimestamp() + ' connect  ' + "</p>")
            $("#socketStatus").html("<p class='green'> connected  </p>")
            $("#socketId").val(socket.id);
        });
        socket.on('connect_timeout', (timeout) => {
            $("#logs").prepend("<p class='message'>" + nowTimestamp() + ' connect_timeout | ' + timeout + "</p>")
            $("#socketStatus").html("<p class='red'> connection timeout  </p>")
            $("#socketId").val('');
        });
        socket.on('disconnect', (reason) => {
            $("#logs").prepend("<p class='logsRed'>" + nowTimestamp() + ' disconnect | ' + reason + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='red'> disconnected!  </p>")
        })
        socket.on('reconnect_attempt', (attemptNumber) => {
            $("#logs").prepend("<p class='logsOrange'>" + nowTimestamp() + ' reconnect_attempt | ' + attemptNumber + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
        });
        socket.on('reconnect_error', (error) => {
            $("#logs").prepend("<p class='logsRed'>" + nowTimestamp() + ' reconnect_error | ' + error + "</p>")
            //$("#socketStatus").html("<p class='red'> reconnection error  </p>")
            $("#socketId").val('');
        });
        socket.on('reconnect', (attemptNumber) => {
            $("#logs").prepend("<p class='logsGreen'>" + nowTimestamp() + ' reconnect | ' + attemptNumber + "</p>")
            $("#socketStatus").html("<p class='green'> reconnected  </p>")
            $("#socketId").val(socket.id)
        });
        socket.on('reconnecting', (attemptNumber) => {
            $("#logs").prepend("<p class='logsOrange'>" + nowTimestamp() + ' reconnecting | ' + attemptNumber + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
        });
        socket.on('reconnect_failed', () => {
            $("#logs").prepend("<p class='red'>" + nowTimestamp() + ' reconnect_failed' + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='red'> reconnection failed  </p>")
        });
        /*socket.on('ping', () => {
            $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + ' ping' + "</p>")
        });*/
        /*socket.on('pong', (latency) => {
            $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + ' pong | ' + latency + "</p>")
        });*/
        socket.on('connect_error', (error) => {
            $("#logs").prepend("<p class='logsRed'>" + nowTimestamp() + ' connect_error | ' + error + "</p>")
            //$("#socketStatus").html("<p class='red'> connection error  </p>")
            $("#socketId").val("")
        });
        socket.on('error', (error) => {
            $("#logs").prepend("<p class='message'>" + nowTimestamp() + ' error | ' + error + "</p>")
            $("#socketStatus").html("<p class='red'> error  </p>")
            $("#socketId").val("")
        });

        socket.on("welcome", (on_data) => {
            //socket.on('newNotification', (on_data) => {

                incoming++;
                $("#incoming").val(incoming)
                $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + ' received data on '+$("#on_event").val() +' event ('+incoming+ "</p>")

                $("#on_data").prepend("<p class='message'>" + nowTimestamp() + ' ' + 'welcome' + ' | ' + JSON.stringify(on_data) + "</p>")

                if (on_data.length) {
                    $("#on_dataLength").val(on_data.length)
                }
                //$("#on_data").prepend("<p class='on_data'>" + JSON.stringify(on_data) + "</p>")
                
            })

        //custom event
        $("#listenBtn").click(function () {
            $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + 'ON | ' + $("#on_event").val() + "</p>")


            socket.on($("#on_event").val(), (on_data) => {
            //socket.on('newNotification', (on_data) => {

                incoming++;
                $("#incoming").val(incoming)
                $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + ' received data on '+$("#on_event").val() +' event ('+incoming+ "</p>")

                $("#on_data").prepend("<p class='message'>" + nowTimestamp() + ' ' + $("#on_event").val() + ' | ' + JSON.stringify(on_data) + "</p>")

                if (on_data.length) {
                    $("#on_dataLength").val(on_data.length)
                }
                //$("#on_data").prepend("<p class='on_data'>" + JSON.stringify(on_data) + "</p>")
                
            })

            
        })


    }

    //Emit message
    $("#sendBtn").click(function () {
        socket.emit($("#emit_event").val(), {to:$("#emit_to").val(),data:$("#emit_data").val()});
        console.log($("#emit_event").val());
        console.log($("#emit_data").val());
        $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + 'EMIT | ' + $("#emit_event").val() + "</p>")

    })



    //on listen button click
    $("#listen").click(function () {
        console.log("listened")
        listenToSocket($("#server").val());
    })

    //on disconnect button click
    $("#close").click(function () {
        // $("#socketStatus").html("<p class='red'> disconnected!  </p>")
        $("#socketStatus").html("<p class='red'> configure the server and press listen!</p>")

        socket.disconnect();
        /* socket.on($("#on_event").val(), (on_data) => {
             $("#logs").prepend("<p class='logsBlack'>" + nowTimestamp() + $("#on_event").val() + "</p>")

             $("#on_data").prepend("<p class='message'>" + nowTimestamp() + ' ' + $("#on_event").val() + ' | ' + JSON.stringify(on_data) + "</p>")

             if (on_data.length) {
                 $("#on_dataLength").val(on_data.length)
             }
             //$("#on_data").prepend("<p class='on_data'>" + JSON.stringify(on_data) + "</p>")
             incoming++;
             $("#incoming").val(incoming)
         })*/
    })



});
