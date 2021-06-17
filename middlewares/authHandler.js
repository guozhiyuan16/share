const whiteList = [
    "http://localhost:8080"
]

function checkAuth(ctx){
    let referer = ctx.header['referer'];
    // console.log('checkAuth--------',ctx)
    return 1
}

module.exports = async (ctx,next) => {
    const roleList = checkAuth(ctx); 

    if(roleList.roleList > 0 ){
        await next();
    }else{
        await next();
    }
}