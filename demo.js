
    
    function startConnect(){
        clientID = "clientID - "+parseInt(Math.random() * 100);
        //host = "public.mqtthq.com";
        host = "test.mosquitto.org";
        
        //host = "broker.hivemq.com";   
        //host = "broker.emqx.io";   
        port = "8080";     // avec test.mosquitto.org
        //port = "1883"; 
        document.getElementById("messages").innerHTML += "<span> Connecting to " + host + "on port " +port+"</span><br>";
        document.getElementById("messages").innerHTML += "<span> Using the client Id " + clientID +" </span><br>";

        client = new Paho.MQTT.Client(host,Number(port),clientID);

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        client.connect({
            onSuccess: onConnect
    //        userName: userId,
    //       passwordId: passwordId
        });
    }


    function onConnect(){
        topic =  "Tempdata";     
        document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";
        client.subscribe(topic);
        client.subscribe('esp32/photo_1');
    }

    function onConnectionLost(responseObject){
        document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
        if(responseObject !=0){
            document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
        }
    }
    
    function splitStringAtHash(str) {
        var parts = str.split('#');
        if (parts.length === 3) {
            return {
                part1: parts[0],
                part2: parts[1],
                part3: parts[2]
            };
        } else {
            throw new Error('The string does not contain exactly one # character.');
        }
    }

    function onMessageArrived(message){
        var topico = message.destinationName;
        var payload = message.payloadString;

        if (topico === "esp32/photo_1") {
            const base64Complete = `data:image/jpeg;base64,${payload}`;
            const imgElement = document.getElementById('base64Image');
            imgElement.src = base64Complete;
            console.log("Image updated from topic esp32/photo_1");
        } else if (topico === "Tempdata") {
            //console.log("OnMessageArrived: "+message.payloadString);
            document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
            var result = splitStringAtHash(message.payloadString);
            document.getElementById('Cam_Val1').innerHTML = result.part1;
            document.getElementById('Cam_Val2').innerHTML = result.part2;
            document.getElementById('Cam_Val3').innerHTML = result.part3;
            console.log(message.payloadString); // Affiche "560"
            //console.log(result.part2); // Affiche "9.00"
        }
    }

    /*
    function startDisconnect(){
        client.disconnect();
        document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
    }
    */
    function publishMessage(){
        msg = document.getElementById("Message").value;
        topic = document.getElementById("topic_p").value;

        Message = new Paho.MQTT.Message(msg);
        Message.destinationName = topic;

        client.send(Message);
        document.getElementById("messages").innerHTML += "<span> Message to topic "+topic+" is sent </span><br>";
    }
    function Down(){
        Message = new Paho.MQTT.Message("Down");
        Message.destinationName = "lights";
        client.send(Message);       
    }

    function Up(){
        Message = new Paho.MQTT.Message("Up");
        Message.destinationName = "lights";
        client.send(Message);
    }

    function Excur(){
        Message = new Paho.MQTT.Message("Excur");
        Message.destinationName = "lights";
        client.send(Message);
    }

    function Stop(){
        Message = new Paho.MQTT.Message("Stop");
        Message.destinationName = "lights";
        client.send(Message);
    }

    function Raz_milieu(){
        Message = new Paho.MQTT.Message("Raz_milieu");
        Message.destinationName = "lights";
        client.send(Message);
    }

     function Photo(){
        Message = new Paho.MQTT.Message("Photo");
        Message.destinationName = "lights";
        client.send(Message);
    }

   document.addEventListener('DOMContentLoaded', (event) => {
        startConnect();

        // Sélectionnez l'élément de l'input range par son ID
        var lampSlider = document.getElementById('lamp');

        // Fonction pour récupérer la valeur du curseur
        function getSliderValue() {
            // Stockez la valeur du curseur dans une variable
            var sliderValue = lampSlider.value;
            // Affichez la valeur dans la console (ou utilisez-la comme vous le souhaitez)
            console.log(sliderValue);
            Message = new Paho.MQTT.Message(sliderValue);
            Message.destinationName = "lights";
            client.send(Message);
            //client.send(sliderValue);
            return sliderValue;
        }

        // Ajoutez un écouteur d'événement pour détecter les changements sur le curseur
        lampSlider.addEventListener('input', function() {
            // Appelez la fonction pour récupérer et traiter la valeur à chaque changement
            getSliderValue();
        });
    });

