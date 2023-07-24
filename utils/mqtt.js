const mqtt_module = require('mqtt');

//主要是为了连接mqtt服务器
const Mqtt = function(params) {
  this.mqtt = mqtt_module;

  // 随机数(主要是为了生成clientId)
  let outTradeNo = '';
  for (let i = 0; i < 3; i++) {
    outTradeNo += Math.floor(Math.random() * 10);
  }
  outTradeNo = parseInt(new Date().getTime() / 1000) + outTradeNo;
  let options = {
    clientId: 'shd' + outTradeNo,
    username: 'admin',
    password: 'public'
  };

  // 传参处理
  if (params.options) {
    Object.keys(params.options).forEach(key => {
      if (options[key]) options[key] = params.options[key];
    });
  }

  console.log(options.clientId);
  this.client = this.mqtt.connect(params.url || process.env.MQTT_URL, options);

  // 重连次数 超10次就算了
  this.reconnectNum = 0;

  // 连接
  this.conn = function() {
    this.client.on('connect', e => {
      // 订阅
      this.client.subscribe(
        params.theme,
        {
          qos: 1
        },
        () => {
          console.log(
            params.theme.join('----分割线----') + '----分割线----订阅成功'
          );
        }
      );
    });

    this.client.on('message', (topic, message) => {
      //let data = JSON.parse(message.toString())
      let data = message.toString();
      params.handleData && params.handleData(data, topic);
    });

    this.client.on('reconnect', error => {
      this.reconnectNum++;
      if (this.reconnectNum >= 10) this.client.end(true);
      console.log('正在重连:', error);
    });

    this.client.on('error', error => {
      console.log('订阅失败', error);
    });
  };

  this.publish = function(theme, jsonData) {
    this.client.publish(
      theme,
      JSON.stringify(jsonData),
      {
        qos: 1,
        rein: false
      },
      error => {
        if (!error) {
        }
        console.log(error || '发布成功');
      }
    );
  };

  // 关闭
  this.close = function() {
    this.client.end(true);
  };
};

module.exports = Mqtt;
