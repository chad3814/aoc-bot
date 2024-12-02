import { /*NextRequest,*/ NextResponse } from "next/server";

export type RefreshResponse = {
    status: "ok" | "error";
    message?: string;
}

export async function GET(/*req: NextRequest*/): Promise<NextResponse<RefreshResponse>> {
    return NextResponse.json({status: 'ok'});
}
