export async function validateResponse(response: Response): Promise<Response> {
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error fetching data');
    }

    return response;
}