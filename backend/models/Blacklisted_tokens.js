const moongoose=require('mongoose');    
const blacklistedTokenSchema = new moongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: '24h' // Token will expire after 24 hours
        }
    });
    
    module.exports = moongoose.model('BlacklistedToken', blacklistedTokenSchema);



    