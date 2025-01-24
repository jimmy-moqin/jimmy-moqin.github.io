/*
* @Author: moqin
* @Date:   2025-01-24 00:11:55
* @Last Modified by:   moqin
* @Last Modified time: 2025-01-24 00:15:28
*/
// 配置 MQTT
const broker = '47.99.159.174';
const port = 1883;
const clientId = "33800CS_C26304124B130D29";
const username = '33800CS';
const password = '2A0D77DD0108BA463AFD6AAF8E0CAE3B';

// 创建 MQTT 客户端
let client = new Paho.Client(broker, port, clientId);

// 设置回调
client.onConnectionLost = function(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("连接丢失: " + responseObject.errorMessage);
    }
};

client.onMessageArrived = function(message) {
    console.log("收到消息: " + message.payloadString);
};

// 连接到 MQTT Broker
client.connect({
    onSuccess: function() {
        console.log("连接成功！");
    },
    userName: username,
    password: password,
    useSSL: false,
    onFailure: function(e) {
        console.error("连接失败: ", e);
    }
});

document.getElementById('checkinForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取表单数据
    const userid = document.getElementById('userid').value;
    const checktype = document.querySelector('input[name="checktype"]:checked').value;
    const datetime = document.getElementById('datetime').value;
    const checktime = new Date(datetime).getTime() / 1000;  // 转换为时间戳

    // 构建消息
    const message = {
        action: 300,
        data: {
            cmd: "checkin",
            payload: {
                users: [
                    {
                        check_time: checktime.toString(),
                        check_type: checktype,
                        user_id: userid
                    }
                ]
            }
        },
        from: "33800CS_C26304124B130D29",
        mid: "173766216614968" + Math.floor(Math.random() * 9000 + 1000),
        time: (checktime + 1).toString(),
        to: "459003186537652225"
    };

    // 将消息转换为字符串
    const messageString = JSON.stringify(message);

    // 发布消息
    const topic = 'device';
    let mqttMessage = new Paho.MQTT.Message(messageString);
    mqttMessage.destinationName = topic;

    // 发送消息
    client.send(mqttMessage);
    console.log("消息已发送：", messageString);
});
