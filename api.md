### 1.登录注册
 
Api path：

```bash
   http://43.198.63.219:1538/api/login
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| address |true | string |地址|
| signed |true | string |签约内容|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "id": 12,
        "address":"0xCAC7BFd2B83DaAcbf6A9f6146CB6dF88f9e05f0d",
        "token": "1212121212121212" //访问本站其他接口要在header中带上此参数
     }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |              


### 2.上传ipfs文件
 
Api path：

```bash
   http://43.198.63.219:1538/api/uploadFile
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| file |true | File |文件|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "url": "https://ipfs.io/ipfs/bafkreigcbadsldmearemyz2x4v5yvzt7l3f2ccqvsifxtup47flvixhreu"
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       


### 3.上传ipfs json数据
 
Api path：

```bash
   http://43.198.63.219:1538/api/uploadJson
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| jsonData |true   | bas464(json) |string|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "url": "https://ipfs.io/ipfs/bafkreigcbadsldmearemyz2x4v5yvzt7l3f2ccqvsifxtup47flvixhreu"
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       


### 4.加密内容
 
Api path：

```bash
   http://43.198.63.219:1538/api/encryptContent
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| url |true   | ipfs url |string|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "encrypted": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxreeeeeee"
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 5.解锁加密内容
 
Api path：

```bash
   http://43.198.63.219:1538/api/unlockContent
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| encrypted |true   | 加密后的url |string|
| tokenId |true   | 要解密的的tokenId |int|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "url": "https://111111/ipfs/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxreeeeeee"
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 6.每天签到
 
Api path：

```bash
   http://43.198.63.219:1538/api/checkIn
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| signed |true   | 钱包签的内容 Wellcome to DOUJI,A beautiful day has begun! |string|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
      "amount": 1212121 //签到获取的mbd额度
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 7.每隔5分钟检查一下有没有要下发的盲盒
 
Api path：

```bash
   http://43.198.63.219:1538/api/checkHasBox
```

##### HTTP request method

get

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "get_box_flag": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  //获取盲盒的时候要用到
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |     

### 8.收盲盒
 
Api path：

```bash
   http://43.198.63.219:1538/api/getBox
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| signed |true   | 钱包签的内容 Collect DOUJI Blind Box! |string|
| get_box_flag |true   | 收取标志 接口7提供 |string|
| tokenId |true   | 当前页面的 tokenId |int|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
       "open_box_flag": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" //开盲盒标志
       "amount": 1212121 //签到获取的mbd额度
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 9.开盲盒
 
Api path：

```bash
   http://43.198.63.219:1538/api/openBox
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| signed |true   | 钱包签的内容 Open DOUJI Blind Box! |string|
| open_box_flag |true   | 收取标志 接口8提供 |string|
| hashTx |true   | 转账交易hash |string|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
      "amount": 1111, 
      "coin": "MBD" //MBD|BJXStar NFT
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |      

### 10.上传ipfs 文本数据
 
Api path：

```bash
   http://43.198.63.219:1538/api/uploadContent
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| contentData |true   | bas464(content) |string|
##### Response parameters:

```json
{
  "code": 1,
  "message": "ok",
  "data": {
    "url": "https://ipfs.io/ipfs/bafkreigcbadsldmearemyz2x4v5yvzt7l3f2ccqvsifxtup47flvixhreu"
  }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       


### 11.NFT内容分类
 
Api path：

```bash
   http://43.198.63.219:1538/api/getNftTypes
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
        "list": [
            {
                "id": 1,
                "e_name": "Article",
                "c_name": "文章",
                "status": 1
            },
            {
                "id": 2,
                "e_name": "Prompt",
                "c_name": "Prompt指令",
                "status": 1
            },
            {
                "id": 3,
                "e_name": "Digital Arts",
                "c_name": "數字藝術品",
                "status": 1
            },
            {
                "id": 4,
                "e_name": "Graphic Novels",
                "c_name": "圖像小說",
                "status": 1
            },
            {
                "id": 5,
                "e_name": "Electric Book",
                "c_name": "電子書",
                "status": 1
            },
            {
                "id": 6,
                "e_name": "Photography",
                "c_name": "攝影",
                "status": 1
            },
            {
                "id": 7,
                "e_name": "Audio",
                "c_name": "音頻",
                "status": 1
            },
            {
                "id": 8,
                "e_name": "Video",
                "c_name": "影視",
                "status": 1
            },
            {
                "id": 9,
                "e_name": "Social Media Posts",
                "c_name": "社交媒體帖子",
                "status": 1
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       


### 12.NFT内容分类
 
Api path：

```bash
   http://43.198.63.219:1538/api/getNftCategoriesByType
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| type |true   | 1 |int|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
        "list": [
            {
                "id": 4,
                "e_name": "AI",
                "c_name": "人工智能"
            },
            {
                "id": 5,
                "e_name": "AIGC",
                "c_name": "生成式人工智能"
            },
            {
                "id": 11,
                "e_name": "Bitcoin",
                "c_name": "比特幣"
            },
            {
                "id": 12,
                "e_name": "BlockChain",
                "c_name": "區塊鏈"
            },
            {
                "id": 14,
                "e_name": "Business",
                "c_name": "商業"
            },
            {
                "id": 18,
                "e_name": "ChatGPT",
                "c_name": "ChatGPT"
            },
            {
                "id": 25,
                "e_name": "Crypto",
                "c_name": "加密貨幣"
            },
            {
                "id": 29,
                "e_name": "DiFi",
                "c_name": "去中心化金融"
            },
            {
                "id": 34,
                "e_name": "Ethereum",
                "c_name": "以太坊"
            },
            {
                "id": 37,
                "e_name": "Finance",
                "c_name": "金融"
            },
            {
                "id": 43,
                "e_name": "GameFi",
                "c_name": "遊戲金融"
            },
            {
                "id": 57,
                "e_name": "IT",
                "c_name": "IT"
            },
            {
                "id": 63,
                "e_name": "Markets",
                "c_name": "市場"
            },
            {
                "id": 64,
                "e_name": "Metaverse",
                "c_name": "元宇宙"
            },
            {
                "id": 72,
                "e_name": "NFT",
                "c_name": "NFT"
            },
            {
                "id": 96,
                "e_name": "Software",
                "c_name": "軟件"
            },
            {
                "id": 106,
                "e_name": "Technology",
                "c_name": "科技"
            },
            {
                "id": 109,
                "e_name": "Tools",
                "c_name": "工具應用"
            },
            {
                "id": 116,
                "e_name": "Web3",
                "c_name": "Web3"
            },
            {
                "id": 118,
                "e_name": "WIKI",
                "c_name": "維基百科"
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 13.NFT内容语音
 
Api path：

```bash
   http://43.198.63.219:1538/api/getNftLanguages
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
        "list": [
            {
                "id": 1,
                "english": "English",
                "chinese": "英语",
                "status": 1
            },
            {
                "id": 2,
                "english": "Chinese",
                "chinese": "中文",
                "status": 1
            },
            {
                "id": 3,
                "english": "Japanese",
                "chinese": "日語",
                "status": 1
            },
            {
                "id": 4,
                "english": "Korean",
                "chinese": "韓語",
                "status": 1
            },
            {
                "id": 5,
                "english": "Spanish",
                "chinese": "西班牙語",
                "status": 1
            },
            {
                "id": 6,
                "english": "French",
                "chinese": "法語",
                "status": 1
            },
            {
                "id": 7,
                "english": "Russian",
                "chinese": "俄語",
                "status": 1
            },
            {
                "id": 8,
                "english": "German",
                "chinese": "德語",
                "status": 1
            },
            {
                "id": 9,
                "english": "Portuguese",
                "chinese": "葡萄牙語",
                "status": 1
            },
            {
                "id": 10,
                "english": "Italian",
                "chinese": "意大利語",
                "status": 1
            },
            {
                "id": 11,
                "english": "Arabic",
                "chinese": "阿拉伯語",
                "status": 1
            },
            {
                "id": 12,
                "english": "Other",
                "chinese": "其他語種",
                "status": 1
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 14.NFT内容平台
 
Api path：

```bash
   http://43.198.63.219:1538/api/getNftPlatformsByType
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| type |true   | 2 |int|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
        "list": [
            {
                "id": 1,
                "e_name": "Earnie Bot",
                "c_name": "文言一心",
                "status": 1
            },
            {
                "id": 2,
                "e_name": "DALL·E",
                "c_name": "DALL·E",
                "status": 1
            },
            {
                "id": 3,
                "e_name": "GPT",
                "c_name": "GPT",
                "status": 1
            },
            {
                "id": 4,
                "e_name": "Leonardo Ai",
                "c_name": "Leonardo Ai",
                "status": 1
            },
            {
                "id": 5,
                "e_name": "Llama",
                "c_name": "Llama",
                "status": 1
            },
            {
                "id": 6,
                "e_name": "Midjourney",
                "c_name": "Midjourney",
                "status": 1
            },
            {
                "id": 7,
                "e_name": "Stable Diffusion",
                "c_name": "Stable Diffusion",
                "status": 1
            },
            {
                "id": 8,
                "e_name": "IFlytek Spark",
                "c_name": "訊飛星火",
                "status": 1
            },
            {
                "id": 9,
                "e_name": "GLM",
                "c_name": "智譜清言",
                "status": 1
            },
            {
                "id": 10,
                "e_name": "Tongyi Qianwen",
                "c_name": "通義千問",
                "status": 1
            },
            {
                "id": 11,
                "e_name": "Grace",
                "c_name": "字節豆包",
                "status": 1
            },
            {
                "id": 12,
                "e_name": "PANGU",
                "c_name": "華為盤古",
                "status": 1
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |       

### 15.更新用户信息
 
Api path：

```bash
   http://43.198.63.219:1538/api/updateUserInfo
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| nickname |true   | 昵称 |string|
| head_img |true   | 头像url |string|
| short_description |true   | short_description |string|
| location |true   | location |string|
| twitter |true   | twitter |string|
| telegram |true   | telegram |string|
| facebook |true   | facebook |string|
| tiktok |true   | tiktok |string|
| linkedin |true   | linkedin |string|
| medium |true   | medium |string|
| whatsapp |true   | whatsapp |string|
| website |true   | website |string|
| instagram |true   | instagram |string|
| youtube |true   | youtube |string|
| github |true   | github |string|
| wechat |true   | wechat |string|
| discord |true   | discord |string|
| line |true   | line |string|
| bilibili |true   | bilibili |string|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 16.获取用户信息
 
Api path：

```bash
   http://43.198.63.219:1538/api/getUserInfo
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |

##### Response parameters:

```json
{
    "code": 1,
    "message": "success",
    "data": {
        "id": 60,
        "address": "0X36CBE8B131451DC4BAE73B867DB998504CF2A86F",
        "nickname": null,
        "head_img": null,
        "status": 0,
        "create_time": "2023-10-20 17:21:57",
        "update_time": null,
        "email": null,
        "short_description": null,
        "location": null,
        "twitter": null,
        "telegram": null,
        "facebook": null,
        "tiktok": null,
        "linkedin": null,
        "medium": null,
        "whatsapp": null,
        "website": null,
        "instagram": null,
        "youtube": null,
        "github": null,
        "wechat": null,
        "discord": null,
        "line": null,
        "bilibili": null
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    



### 17.我的NFT
 
Api path：

```bash
   http://43.198.63.219:1538/api/myNfts
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
| keyW |true   | string |关键字|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "pageCount":11,
        "page":1,
        "list":[
            {
                "token_id":1,
                "name":"Darkness Of light",
                "title":"Darkness Of light",
                "image":"https:\/\/img.tamagonft.xyz\/697214642.jpg",
                "description":"A place of darkness with the small light from the shadow and the heavy rain and mist of elements",
                "category":"Social Media\/SEO",
                "content_type":null,
                "owner_address":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "language":"Unset",
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "holdCount":5
            },
            {
                "token_id":8,
                "name":"The Mischievous Monkey and the Clever Capture: A T",
                "title":"The Mischievous Monkey and the Clever Capture: A T",
                "image":"https:\/\/ipfs.io\/ipfs\/bafybeibazb63rakworln3fa3mhgfgsqo36km4ructzosdfqolm4ouoauwi",
                "description":"Marvin, a mischievous monkey, wreaks havoc in a town until an old man cleverly uses free bananas to trap him, teaching everyone a valuable l",
                "category":"Business",
                "content_type":"Article",
                "owner_address":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "holdCount":50
            },
            {
                "token_id":10,
                "name":"Wix Launches Conversational AI Chat for Personaliz",
                "title":"Wix Launches Conversational AI Chat for Personaliz",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreibpp7gcnjsg3ais4sazatdsxr4fmy3yv367mujj7wnkjbeyon54oe",
                "description":"Wix.com has introduced a conversational AI chat feature for human-like conversations and essential insights into specific business objective",
                "category":"AI",
                "content_type":"Article",
                "owner_address":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "holdCount":50000
            },
            {
                "token_id":11,
                "name":"Best 7 AI Text Humanizers to Convert from ChatGPT into Human-Written Text",
                "title":"Best 7 AI Text Humanizers to Convert from ChatGPT into Human-Written Text",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreihsw75pkrp4hpu7wukczgk6neiy5vrd2vwkgasaoxvwuckfwcwiqy",
                "description":"AI-generated content can sometimes sound robotic and mechanical. Now, there’s a solution that bridges this gap and ensures your AI-generated text is not only human-like but also undetectable by AI detectors.",
                "category":"ChatGPT",
                "content_type":"Article",
                "owner_address":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "holdCount":50
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 18.NFT列表
 
Api path：

```bash
   http://43.198.63.219:1538/api/nftList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
| content_type |true   | string |类型|
| category |true   | string |分类|
| pltform |true   | string |平台|
| orderField |true   | int |1时间 2价格|
| orderBy |true   | string |asc desc|
| keyW |true   | string |关键字|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list":[
            {
                "id":7,
                "token_id":7,
                "name":"Outman",
                "title":"Outman",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreifivdsx2gcsolhrdqthuiryz3p5pfxjvhpeqikiycipw7s6c476ai",
                "description":"奥特曼，又称「初代奥特曼」，是日本特摄剧《奥特曼》中的主人公 [6] 。首次登场于《奥特曼》第1话《奥特作战第一号》（1966年7月17日首播）",
                "category":null,
                "content_type":"Digital Arts",
                "owner_address":"0x36cbe8b131451dc4bae73b867db998504cf2a86f",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "price": 100,//无精度 实际价格
                "pltform":null,
                "nickname":"你是什么夫斯基",
                "head_img": "url"
            }
        ],
        "pageCount":11,
        "page":1
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 19.NFT订单列表
 
Api path：

```bash
   http://43.198.63.219:1538/api/nftOrders
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
| tokenId |true   | int |tokenId|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list":[
            {
                "id":1,
                "assetAddress":"0xe210760d3f8b9b820856443547abfafdc5101705",
                "tokenId":1,
                "tokenValue":1,
                "nftType":1,
                "owner":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "price":10000000,
                "active":1,
                "ended":0,
                "ordeId":1
            }
        ],
        "page":1
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 20.用户当日阅读情况
 
Api path：

```bash
   http://43.198.63.219:1538/api/getTodayReadData
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |

##### Response parameters:

```json
{
    "code":1,
    "message":"success",
    "data":{
        "income_sum":1.0000, //今日收益
        "duration_sum":1,    //观看时长秒
        "reads_count":1   //领取个数
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 21.通知更新订单
 
Api path：

```bash
   http://43.198.63.219:1538/api/notifyUpdateOrder
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| tokenId |true   | int |tokenId|
##### Response parameters:

```json
{
    "code":1,
    "message":"success",
    "data":{
       
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 22.NFT最后10比交易记录
 
Api path：

```bash
   http://43.198.63.219:1538/api/getNftTransactions
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| tokenId |true   | int |tokenId|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list":[
            {
                "from":"0x910e991a290edf015273696f6c54f340f4e31de5",
                "to":"0x0a8901b0e25deb55a87524f0cc164e9644020eba",
                "event_type":"Transfer",
                "amount":"1",
                "hash": "xxxxxxxx"
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 23.NFT更新uri记录
 
Api path：

```bash
   http://43.198.63.219:1538/api/nftUpdateLog
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| tokenId |true   | int |tokenId|
| page |true   | int |页码 默认1   每页显示20条|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
        "list": [
            {
                "id": 1,
                "tokenId": 1,
                "uri": "https://ipfs.io/ipfs/bafkreigv7by3mhtg5ztzpzam22fibusrgsiuvwd2nyzxvsdbzlrrufcpmm",
                "create_time": "2023-11-11 16:29:34",
                "transactionHash": "0x6abd70134130c810cb5672c3b792dd6f2a0ebc2ea3ec506b11f4c9a9e3f0b432",
                "block_number": null
            }
        ],
        "pageCount": 1,
        "page": 1
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |


### 24.质押解押通知
 
Api path：

```bash
   http://43.198.63.219:1538/api/notifypledge
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| tokenId |true   | int |tokenId|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |


### 25.质押待结算列表
 
Api path：

```bash
   http://43.198.63.219:1538/api/pledgeSettleList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       "list": [
          {"token_id":111111,"name": "11111"}
       ],
       "page": 1,
       "pageCount": 3
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |

### 26.热门
 
Api path：

```bash
   http://43.198.63.219:1538/api/hotList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list":[
            {
                "id":7,
                "token_id":7,
                "name":"Outman",
                "title":"Outman",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreifivdsx2gcsolhrdqthuiryz3p5pfxjvhpeqikiycipw7s6c476ai",
                "description":"奥特曼，又称「初代奥特曼」，是日本特摄剧《奥特曼》中的主人公 [6] 。首次登场于《奥特曼》第1话《奥特作战第一号》（1966年7月17日首播）",
                "category":null,
                "content_type":"Digital Arts",
                "owner_address":"0x36cbe8b131451dc4bae73b867db998504cf2a86f",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "pltform":null,
                "nickname":"你是什么夫斯基",
                "head_img": "url"
            }
        ],
        "pageCount":11,
        "page":1
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 27.精选
 
Api path：

```bash
   http://43.198.63.219:1538/api/selectedList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list":[
            {
                "id":7,
                "token_id":7,
                "name":"Outman",
                "title":"Outman",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreifivdsx2gcsolhrdqthuiryz3p5pfxjvhpeqikiycipw7s6c476ai",
                "description":"奥特曼，又称「初代奥特曼」，是日本特摄剧《奥特曼》中的主人公 [6] 。首次登场于《奥特曼》第1话《奥特作战第一号》（1966年7月17日首播）",
                "category":null,
                "content_type":"Digital Arts",
                "owner_address":"0x36cbe8b131451dc4bae73b867db998504cf2a86f",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "pltform":null,
                "nickname":"你是什么夫斯基",
                "head_img": "url"
            }
        ],
        "pageCount":11,
        "page":1
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 28.关注
 
Api path：

```bash
   http://43.198.63.219:1538/api/followUser
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| be_uid |true   | int | 被关注人 |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    


### 29.取消关注
 
Api path：

```bash
   http://43.198.63.219:1538/api/unfollowUser
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| be_uid |true   | int | 被关注人 |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 30.查询用户信息
 
Api path：

```bash
   http://43.198.63.219:1538/api/getOtUserInfo
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| address |true   | string | 用户地址 |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
         "isfollow": 0/1 //是否关注了对方
         "nickname": "ssss",
         "head_img": "头像url",
         "fans": 121212, //粉丝数
         "short_description": "简介",
         "location": "mexico",
         "twitter": "twitter",
         "telegram": "telegram",
         "website": "website",
         "instagram": "instagram",
         "youtube": "youtube",
         "facebook": "facebook",
         "github": "github",
         "tiktok": "tiktok",
         "linkedin": "linkedin"
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    



### 31.NFTinfo
 
Api path：

```bash
   http://43.198.63.219:1538/api/nftInfo
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| tokenId |true   | int |tokenId|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
            "id":7,
            "token_id":7,
            "name":"Outman",
            "title":"Outman",
            "image":"https:\/\/ipfs.io\/ipfs\/bafkreifivdsx2gcsolhrdqthuiryz3p5pfxjvhpeqikiycipw7s6c476ai",
            "description":"奥特曼，又称「初代奥特曼」，是日本特摄剧《奥特曼》中的主人公 [6] 。首次登场于《奥特曼》第1话《奥特作战第一号》（1966年7月17日首播）",
            "category":null,
            "content_type":"Digital Arts",
            "owner_address":"0x36cbe8b131451dc4bae73b867db998504cf2a86f",
            "language":null,
            "read_duration":"0.00",
            "collect_count":0,
            "praise_count":0,
            "pltform":null,
            "nickname":"你是什么夫斯基",
            "head_img": "url"
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |    

### 32.walletinfo
 
Api path：

```bash
   http://43.198.63.219:1538/api/walletinfo
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
          "list": [
              {
                 "uid":121212,
                 "wallet_type":1,  //mbd
                 "balance": 121212
              },
              {
                 "uid":121212,
                 "wallet_type":2,  //BJXStar
                 "balance": 121212
              }
          ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   


### 33.结算提现
 
Api path：

```bash
   http://43.198.63.219:1538/api/settle
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| signed |true   | Are you sure you want to settle? |签名内容|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   


### 34.合约签到。首先跟用用户信息里面 isge8model = 1 来判断是不是走合约模式
 
Api path：

```bash
   运合约地址  0xc83732d70A2d23b1863a655Cc11Ee6F1CC3D02Ac  方法 checkIn
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
       "说明": "签到成功后交易完成之后获取交易hash 调用中心的 35接口 "
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   


### 35.通过合约交易hash签到
 
Api path：

```bash
  http://43.198.63.219:1538/api/checkInByTxhash
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| txhash |true   | string |交易hash|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |  



### 36.合约检查是否有盲盒。首先跟用用户信息里面 isge8model = 1 来判断是不是走合约模式
 
Api path：

```bash
   运合约地址  0xc83732d70A2d23b1863a655Cc11Ee6F1CC3D02Ac  方法 checkBox
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "bool": "是否有盒子 如果有盒子true则调用合约方法 openBox  去开盒子。如果没有盒子则调用 getBox 去获取合约", 
        "uint8": "本周期领盒子数，如果数量>=12 则不在调用合约方法 getBox 去获取合约"
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   



### 37.先掉合约的  getBox 通过合约交易hash 调用中心 getBoxByTxhash 
 
Api path：

```bash
  http://43.198.63.219:1538/api/getBoxByTxhash
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| txhash |true   | string |交易hash|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |  

### 38.先掉合约的  openBox 通过合约交易hash 调用中心 openBoxByTxhash 
 
Api path：

```bash
  http://43.198.63.219:1538/api/openBoxByTxhash
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| txhash |true   | string |交易hash|
| open_box_flag |true   | string |开盒标记|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |  

### 39.广告
 
Api path：

```bash
  http://43.198.63.219:1538/api/getAds
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| type |true   | int |1 全站  2首页|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "list": [
           {
              "img": "11111",
              "url": "2222222"
           }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |  

### 40.用户NFT
 
Api path：

```bash
   http://43.198.63.219:1538/api/userNfts
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
| address |true   | string |地址|
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "pageCount":11,
        "page":1,
        "list":[
            {
                "token_id":11,
                "name":"Best 7 AI Text Humanizers to Convert from ChatGPT into Human-Written Text",
                "title":"Best 7 AI Text Humanizers to Convert from ChatGPT into Human-Written Text",
                "image":"https:\/\/ipfs.io\/ipfs\/bafkreihsw75pkrp4hpu7wukczgk6neiy5vrd2vwkgasaoxvwuckfwcwiqy",
                "description":"AI-generated content can sometimes sound robotic and mechanical. Now, there’s a solution that bridges this gap and ensures your AI-generated text is not only human-like but also undetectable by AI detectors.",
                "category":"ChatGPT",
                "content_type":"Article",
                "owner_address":"0xb51dcc6075778ae0ce49c61db0326e412b40ddf1",
                "language":null,
                "read_duration":"0.00",
                "collect_count":0,
                "praise_count":0,
                "holdCount":50
            }
        ]
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   

### 41.大盘数据
 
Api path：

```bash
   http://43.198.63.219:1538/api/marketData
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code":1,
    "message":"ok",
    "data":{
        "id":2,
        "day":"2023-12-03",
        "nft_count":7,//tokenid数量
        "market_cap":"8300.000000",//总市值
        "mbd_circulation":"500000000000.000000",//MBD流通量
        "nft_volume":"0.000000",//NFT交易额
        "nft_volume_24h":"0.000000",//NFT上24小时交易额
        "transfers":0,//NFT交易数量
        "transfers_24h":0,//NFT上24小时交易数量
        "weekly_active_users":19,//活跃用户
        "nft_createcount_24h":0,//NFT24小时候创建数量
        "mbd_price":"0.000010",//MBD价格
        "nft_count_rate":"-",
        "market_cap_rate":"-",
        "mbd_circulation_rate":"-",
        "nft_volume_rate":"-",
        "nft_volume_24h_rate":"-",
        "transfers_rate":"-",
        "transfers_24h_rate":"-",
        "weekly_active_users_rate":"-",
        "nft_createcount_24h_rate":"-",
        "mbd_price_rate":"-",
        "creater_count": 100,//创作者,
        "user_count": 100,//用户数,
        "all_supply": 100,//nft总发行量
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |   



### 42.创作者待结算列表
 
Api path：

```bash
   http://43.198.63.219:1538/api/createSettleList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示20条|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       "list": [
          {"token_id":111111,"name": "11111"}
       ],
       "page": 1,
       "pageCount": 3
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |

### 43.用户作品
 
Api path：

```bash
   http://43.198.63.219:1538/api/createrNftList
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
| page |true   | int |页码 默认1   每页显示18条|
| address |true   | string |地址|
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       "list": [
          {"token_id":111111,"name": "11111"}
       ],
       "page": 1,
       "pageCount": 3
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |

### 44.是否已签到
 
Api path：

```bash
   http://43.198.63.219:1538/api/isCheckIn
```

##### HTTP request method

post

##### Request parameters:

| 参数名   | 约束-required | 类型 | 说明 |
| :------ |:------ | :------    |:------ |
##### Response parameters:

```json
{
    "code": 1,
    "message": "ok",
    "data": {
       "is_check_in": 0/1 //0否 1是
    }
}
```

##### Response the result data code instructions

| code         | 说明                             |
| -------------|:---------------------------------|
| 0            | 失败   |
| 1            | 成功   |



