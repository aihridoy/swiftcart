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
        cached.promise = mongoose.connect(String(MONGODB_URI)).then((m) => m);
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
