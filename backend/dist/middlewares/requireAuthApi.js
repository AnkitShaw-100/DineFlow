function getClerkUserId(req) {
    const auth = req.auth;
    if (!auth)
        return undefined;
    if (typeof auth.userId === "string")
        return auth.userId;
    return undefined;
}
export function requireAuthApi() {
    return (req, res, next) => {
        const userId = getClerkUserId(req);
        if (!userId) {
            return res.status(401).json({ error: { message: "Unauthorized" } });
        }
        next();
    };
}
