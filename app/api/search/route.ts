/* eslint-disable @typescript-eslint/no-explicit-any */
import { eventsFetcher } from "core/fetcher";
import { JsonRpcBody } from "core/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const page = searchParams.get("page") ?? 0;
		const size = searchParams.get("size") ?? 10;
		const search = searchParams.get("search");

		console.log("searchParams=", { page, size, search });

		const { data } = await eventsFetcher.post<JsonRpcBody<any>>("/", {
			id: 0,
			jsonrpc: "2.0",
			method: "search_places",
			params: {
				query: search,
				limit: +size,
			},
		});

		console.log("datar=", data);

		if (!data || !data.result || data.error) return NextResponse.json(data.error);

		return NextResponse.json(data.result);
	} catch (error) {
		console.log("search error=", error);

		return NextResponse.json(error);
	}
}