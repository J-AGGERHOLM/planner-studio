export async function fetchGet(URL) {
    const response = await fetch(URL);

    if (!response.ok) {
        throw new Error('Failed to get:', response.status);
    }

    return response.json();
}

export async function fetchPost(URL, data) {
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to post:', response.status);
    }

    return response;
}
