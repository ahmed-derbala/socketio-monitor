$(function () {
    var incoming = 0; //incoming of incoming
    $("#incoming").val(incoming)

    $("#socketStatus").html("<p class='red'> configure the server and press listen!</p>")

    //var socket = io($("#http").val() + $("#server").val() + ':' + $("#port").val() + $("#namespace").val());

    //listenToSocket($("#server").val());
    function listenToSocket(s) {
        var socket = io($("#http").val() + $("#server").val() + ':' + $("#port").val() + $("#namespace").val());

        //socket = io($("#http").val() + s + ':' + $("#port").val());
        //socket.connect();
        socket.on('connect', () => {
            console.log(socket)
            $("#logs").prepend("<p class='logsGreen'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect  ' + "</p>")
            $("#socketStatus").html("<p class='green'> connected  </p>")
            $("#socketId").val(socket.id);
        });
        socket.on('connect_timeout', (timeout) => {
            $("#logs").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect_timeout | '+timeout + "</p>")
            $("#socketStatus").html("<p class='red'> connection timeout  </p>")
            $("#socketId").val('');

          });
        socket.on('disconnect', (reason) => {
            $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' disconnect | ' + reason + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='red'> disconnected!  </p>")
        })
        socket.on('reconnect_attempt', (attemptNumber) => {
            $("#logs").prepend("<p class='logsOrange'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_attempt | ' + attemptNumber + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
        });
        socket.on('reconnect_error', (error) => {
            $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_error | '+error + "</p>")
            //$("#socketStatus").html("<p class='red'> reconnection error  </p>")
            $("#socketId").val('');
          });
        socket.on('reconnect', (attemptNumber) => {
            $("#logs").prepend("<p class='logsGreen'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect | ' + attemptNumber + "</p>")
            $("#socketStatus").html("<p class='green'> reconnected  </p>")
            $("#socketId").val(socket.id)
        });
        socket.on('reconnecting', (attemptNumber) => {
            $("#logs").prepend("<p class='logsOrange'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnecting | ' + attemptNumber + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='orange'> reconnecting...  </p>")
        });
        socket.on('reconnect_failed', () => {
            $("#logs").prepend("<p class='red'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' reconnect_failed | ' + "</p>")
            $("#socketId").val("")
            $("#socketStatus").html("<p class='red'> reconnection failed  </p>")
        });
        socket.on('ping', () => {
            $("#logs").prepend("<p class='logsBlack'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' ping | ' + "</p>")
        });
        socket.on('pong', (latency) => {
            $("#logs").prepend("<p class='logsBlack'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' pong | ' + latency + "</p>")
        });
        socket.on('connect_error', (error) => {
            $("#logs").prepend("<p class='logsRed'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' connect_error | ' + error + "</p>")
            //$("#socketStatus").html("<p class='red'> connection error  </p>")
            $("#socketId").val("")
        });
        socket.on('error', (error) => {
            $("#logs").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' error | ' + error + "</p>")
            $("#socketStatus").html("<p class='red'> error  </p>")
            $("#socketId").val("")
        });

        socket.on($("#on_event").val(), (on_data) => {
            $("#on_data").prepend("<p class='message'>" + (new Date().getHours()) + ':' + (new Date().getMinutes()) + ':' + (new Date().getSeconds()) + ':' + (new Date().getMilliseconds()) + ' '+$("#on_event").val()+' | '+JSON.stringify(on_data) + "</p>")

            console.log(on_data + ' received on event : ' + $("#on_event").val())
            if (on_data.length) {
                $("#on_dataLength").val(on_data.length)
            }
            //$("#on_data").prepend("<p class='on_data'>" + JSON.stringify(on_data) + "</p>")
            incoming++;
            $("#incoming").val(incoming)


        })
    }

    //Emit message
    $("#sendBtn").click(function () {
        console.log('EMIT | ' + $("#emit_event").val() + ' data : ' + $("#emit_data").val())
        socket.emit($("#emit_event").val(), { from: $("#socketId").val(), to: $("#emit_to").val(), data: $("#emit_data").val() })

    })



    //on listen button click
    $("#listen").click(function () {
        console.log("listened")
        listenToSocket($("#server").val());
    })

    //on disconnect button click
    $("#close").click(function () {
        $("#socketStatus").html("<p class='red'> disconnected!  </p>")

        socket.disconnect();
    })

    

});
