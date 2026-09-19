
export async function studentMiddleware(req, res, next) {
    try {
        const role = req.headers.role;
        if(!role) return res.status(403).json({msg : "Without being a member, access is forbidden."});

        if(role != "STUDENT") return res.status(400).json({msg : "The content is only for students!"});

        next();
    } catch (error) {
        error.functionName = "studentMiddleware";
        return res.status(500).json({msg : "Something went wrong", error})
    }
}