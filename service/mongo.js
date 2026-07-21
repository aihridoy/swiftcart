import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        // maxPoolSize caps the mongoose pool (driver default is 100) so it and
        // the native adapter client don't together exhaust Atlas's connection limit.
        cached.promise = mongoose
            .connect(String(MONGODB_URI), { maxPoolSize: 10 })
            .then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        console.error(err);
        throw err;
    }

    return cached.conn;
}
