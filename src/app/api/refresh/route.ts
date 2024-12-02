import { get } from "@vercel/edge-config";
import { /*NextRequest,*/ NextResponse } from "next/server";

export type RefreshResponse = {
    status: "ok" | "error";
    message?: string;
}

export async function GET(/*req: NextRequest*/): Promise<NextResponse<RefreshResponse>> {
    const message = await get('greeting') as string;

    return NextResponse.json({status: 'ok', message});
}
