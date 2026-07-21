import { MongoClient } from 'mongodb';

var _mongomongoClientPromise;

if (!process.env.MONGODB_CONNECTION_STRING) {
    throw new Error(
        'Invalid/Missing environment variable: "MONGODB_CONNECTION_STRING"'
    );
}

const uri = process.env.MONGODB_CONNECTION_STRING;
// Cap the pool so serverless instances don't each open the driver default of
// 100 connections and exhaust Atlas's shared-tier connection limit.
const options = { maxPoolSize: 10 };

let client;
let mongoClientPromise;

// NODE_ENV, not ENVIRONMENT (which was never set) - the wrong check sent dev
// down the else branch, opening a fresh client on every HMR reload and leaking
// pools until Atlas neared its max-connections cap.
if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongomongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongomongoClientPromise = client.connect();
    }
    mongoClientPromise = global._mongomongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    mongoClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClientPromise;