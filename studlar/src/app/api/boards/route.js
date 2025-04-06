export async function PUT(request) {
    const body = await request.json();
    
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/boards/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body),
        });
        const data = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: data.error }), { status: 400 });
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams  } = new URL(request.url);
        const id = searchParams .get("id");
        const owner_id = searchParams .get("owner_id");

        const response = await fetch(`${process.env.API_BASE_URL}/api/boards/?id=${id}&owner_id=${owner_id}`, {
            method: "DELETE"
        });

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

export async function POST(request) {
    try {
        const { name, description, owner_id } = await request.json();

        const response = await fetch(`${process.env.API_BASE_URL}/api/boards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description, owner_id }),
        });

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
