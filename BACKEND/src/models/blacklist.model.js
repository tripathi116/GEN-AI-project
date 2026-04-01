const mongoose = require("mongoose");


const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "token is required to be added in the blacklist"]
    }

},
{
    timestamps:true
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistSchema)


module.exports = tokenBlacklistModel;