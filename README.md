## 命名规则
```
p 人员数量信息
t 温度
l 光线亮度
cf 风扇状态 00 - 11
cl 小灯状态 00 -11

tl tr温度范围
ll lr亮度范围
cf 控制风扇
cl 控制灯光
```

## 两个订阅
- show
```json
l 光线亮度
t 温度
p 人员数量信息
cl 小灯状态 00 -11
cf 风扇状态 00 - 11

{
    "status":"ok",
    "data":[
        {
            "p": "10",
            "t": "30",
            "l": "100",
            "cf": "01",
            "cl": "01",
            "date": "15:46:30"
        }
    ]   
}
```
- cont  
需要控制的东西有cf cl tl tr ll lr
```  json 
tl tr温度范围
ll lr亮度范围
cf 控制风扇
cl 控制灯光
{
    "status":"ok",
    "data":[
        {
          "a": "100",
          "dl": "190000",
          "dr": "240000",
          "d": "60",
          "cd": "11",
          "cl": "1000"
        }
    ]
}
```

test
``` json
{
    "status":"ok",
    "data":[
        {
            "n": "1"
        }
    ]   
}
```