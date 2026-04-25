export function notFound(_req, res) {
    res.status(404).json({ error: { message: "Route not found" } });
}
export function errorHandler(err, _req, res, _next) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    res.status(500).json({ error: { message } });
}
