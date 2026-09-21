export async function teachersMiddleware(req, res, next) {
    try {
        const role = req.headers.role;
        if(!role) return res.status(403).json({msg : "Without being a member, access is forbidden."});

        if(role !== "TEACHER") return res.status(400).json({msg : "The content is only for teachers!"});
        if(req.method !== "POST" || req.path !== "/create") {
            if(!req.headers.teacherid) return res.status(400).json({msg : "teacherId header is required."});
        }
        req.teacherId = req.headers.teacherId;
        next();
    } catch (error) {
        error.functionName = "teachersMiddleware";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return res.status(500).json({msg : "Something went wrong!!"});
    }    
}