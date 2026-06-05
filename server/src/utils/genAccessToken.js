import jwt from "jsonwebtoken";

const genAccessToken = (_id, role) => {
    const payload = {_id, role};

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:"1d",
    });
};

export default genAccessToken;
