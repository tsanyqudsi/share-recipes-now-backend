import { getCookie, deleteCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export async function cookieAuth(c: any, next: any) {
    const token = getCookie(c, "__session");
    if (!token) return c.json({ message: "No token found" }, 404);

    try {
        const user = await verify(token, process.env.SECRET!);
        c.set("user", user);
        await next();
    } catch (error) {
        deleteCookie(c, "__session");
        return c.json({ error: error.message.split(" ").pop() }, 403);
    }
}