const request = require("superagent");
const {wxConfig} = require("../conf");
const User = require('../libs/user');

function getSessionKey(code, appId, appSecret){
    return new Promise((resolve, reject) => {
        request
            .get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`)
            .end((err, res) => {
                if(err){
                    reject(err);
                }else{
                    resolve(res.text);
                }
            })
    })
}

exports.login = async function(ctx){
    let data = ctx.request.body;
    let res = JSON.parse(await getSessionKey(data.code, wxConfig.appId, wxConfig.appSecret));
    //用openid去检查是不是数据库中有内容 如果有就算了 没有就发token
    //下面是发token的逻辑`
    let user = {
        openId: res['openid'],
        sessionKey: res['session_key'],
        headImage: data.avatarUrl,
        nickname: data.nickname
    };
    let token = await (new User('123')).setUser(user);
    ctx.returns({token});
};

