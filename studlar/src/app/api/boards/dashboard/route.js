export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const user = searchParams.get("owner_id");

        const response = await fetch(
            `${process.env.API_BASE_URL}/api/users/${user}/boards/`
        );

        const data = await response.json();
        if (response.ok) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: data.error }), {
                status: 400,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
