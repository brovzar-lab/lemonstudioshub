import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

type WithAuthOptions = {
  requiredRole?: Role;
};

type AuthenticatedRequest = NextRequest & {
  user: { id: string; role: Role; email: string };
};

type RouteHandler = (req: AuthenticatedRequest) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: RouteHandler, options: WithAuthOptions = {}) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    const roleOrder: Role[] = ["PARTNER", "DEV_TEAM", "HOD", "ADMIN"];
    if (
      options.requiredRole &&
      roleOrder.indexOf(userRole) < roleOrder.indexOf(options.requiredRole)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: session.user.id!,
      role: userRole,
      email: session.user.email!,
    };

    return handler(authenticatedReq);
  };
}
