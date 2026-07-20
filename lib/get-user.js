import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";

// Server-side user fetch with the same authorization as GET /api/users/[id]:
// must be logged in, and may only view own profile unless admin. Returns
// one of: { status: "unauthorized" } (redirect to login),
// { status: "notfound" } (404), or { status: "ok", user }.
export async function getUserForViewer(id) {
  const userSession = await session();
  if (!userSession?.user) {
    return { status: "unauthorized" };
  }

  if (userSession.user.role !== "admin" && userSession.user.id !== id) {
    return { status: "unauthorized" };
  }

  await dbConnect();

  let user;
  try {
    user = await User.findById(id).select("-password").lean();
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return { status: "notfound" };
    }
    throw error;
  }

  if (!user) {
    return { status: "notfound" };
  }

  // Plain-object-ify for safe rendering (ObjectId/Date -> string primitives).
  return {
    status: "ok",
    user: {
      _id: user._id.toString(),
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
      role: user.role ?? null,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    },
  };
}
