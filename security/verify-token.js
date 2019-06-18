


module.exports = verifyToken = (req, res, next) => {
    try {
        //get auth header value
        const bearerHeader = req.headers['authorization'];

        //get token of bearer header !== undefined
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            if (bearer[0] === 'Bearer') {
                req.token = bearer[1];
                //proceed to next
                next();
            } else {
                res.status(401).json('Incorrect Authorization Header Configuration');
            }
        } else {
            res.status(401).json('Access Denied!');
        }
    } catch (e) {
        res.status(401).json(e.message);
    }
};