export async function DELETE(request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Missing id" }),
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_BASE_URL}/api/tasklists/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            return new Response(JSON.stringify({ message: "Tasklist deleted"}), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
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

export async function PUT(request) {
    try {
        const req = await request.json();
        const response = await fetch(`${process.env.API_BASE_URL}/api/tasklists/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });

        const data = await response.json();
        if (response.ok) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 400,
            });
        }
    } catch {error} {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const req = await request.json();
        const response = await fetch(`${process.env.API_BASE_URL}/api/tasklists/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
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