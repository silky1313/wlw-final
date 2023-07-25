# 电动自行车

## 1.emqx订阅相关

### 1.1 存储信息

订阅名`show1`和`show2`

show1控制第一辆

show2控制第二辆

现在有两小车

_id分别为`64be1c4fd6ac26e2ca6409ce`  `64be1c79d6ac26e2ca6409cf`

```json
{
    "status":"ok",
    "data":[
        {
            "_id":"64be1c4fd6ac26e2ca6409ce",
            "GPS":"(118.3E,44,6N)",
            "RFID": "12345678",
            "V1":100,
            "V2": 50,
            "I":100,
            "T":100,
            "speed":100
        }
    ]
}
```

单位分别为V，A,  S,  km/h

### 1.2控制硬件

订阅名`cont1`和`cont2`

```json
{
    "status":"ok",
    "data":[
        {
        	"_id": "64be1c4fd6ac26e2ca6409ce",
            "openswitch":"0/1",
            "opentrumpet":"0/1"
        }
    ]
}
```

分别控制电动车开关,控制喇叭开关

后端会一直给cont1和cont2订阅发送

```json
{"status":"ok"};
```

## 2.路由相关

路由前缀`http:127.0.0.1:8008/stu/v1`

成功的status都是200，失败都是500。

### 2.1失败消息统一格式

```js
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    code: err.statusCode,
    
    //1）错误信息
    message: err.message,

    //2）判断错误来自哪里
    status: err.status,

    //3）判断是否是代码错误
    isOperational: err.isOperational,

    //4）错误栈信息
    stack: err.stack
  });
};
```

### 2.2登录路由`/login`

请求响应的数据类型: application/json

请求类型： post

request:

```json
{
    "username": "admin",
    "password": "123456"
}
```

reponse

```json
res.status(200).json({
    code: 200,
    msg: 'login is success'
});
```

### 2.2获取数据库信息`/data`

get请求获取数据库信息

请求URL：/data?msg=User(可以是任何表名)

```js
res.status(200).json({
    code: 200,
    msg: 'success',
    result
});
```

现在数据库有两个表User和Bike

这是bike

```json
{
    "code": 200,
    "msg": "success",
    "result": [
        {
            "_id": "64bf73e313ed8f53e88371d8",
            "GPS": "(118.3E,44,6N)",
            "RFID": "12345678",
            "V1": 100,
            "V2": 50,
            "I": 100,
            "T": 100,
            "speed": 30
        },
        {
            "_id": "64bf741213ed8f53e88371d9",
            "GPS": "(118.3E,44,6N)",
            "RFID": "12345678",
            "V1": 27.5,
            "V2": 20,
            "I": 10,
            "T": 30,
            "speed": 30
        }
    ]
}
```

这是User

```json
{
    "code": 200,
    "msg": "success",
    "result": [
        {
            "_id": "64b92d42ee1e2ea7d758084a",
            "username": "lz"
        },
        {
            "_id": "64b92ea161f88a469825cd25",
            "username": "ly",
            "__v": 0
        },
        {
            "_id": "64b932b29048f8572851403a",
            "username": "george",
            "__v": 0
        },
        {
            "_id": "64be0ed4574f7734ef5af55a",
            "username": "admin"
        }
    ]
}
```

