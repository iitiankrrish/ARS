const jwt = require('jsonwebtoken');

const secretKey = "krrish";
function setUser(user){
    const plainUser = {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role:user.role,
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt
    };
    return jwt.sign(plainUser, secretKey);
}

function getUser(token){
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null; // Return null if verification fails
    }
}
module.exports = {setUser , getUser}