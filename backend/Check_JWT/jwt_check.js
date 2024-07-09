import jwt from 'jsonwebtoken'

export const jwt_verify = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return  res.status(401).json({message: 'Invalid token'})
        const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT,
        (err, decoded) => {
            if (err) return res.status(401).json({message: 'unauthorized'})
                req.user = decoded.officer.id;
            req.role = decoded.officer.role
            next()
        }
    )

}