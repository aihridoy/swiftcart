export async function sendEmail({ to, subject, html }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ to, subject, html }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to send email");

        return result;
    } catch (error) {
        console.error("Error in sendEmail action:", error);
        throw error;
    }
};