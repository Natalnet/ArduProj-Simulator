export async function handle({ event, resolve }) {
	const response = await resolve(event);
	if (response.headers.get('content-type').startsWith('text/html')) {
		const body = await response.text();
		return new Response(body.replace(/cloud/g, 'butt'), response);
	}

	return response;
}