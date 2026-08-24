function getCsrfToken() {
    return document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
}
export async function fetchGet(URL) {
    const response = await fetch(URL);

    if (!response.ok) {
        throw new Error('Failed to get:', response.status);
    }

    return response.json();
}

export async function fetchPost(URL, data) {
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to post:', response.status);
    }

    return response;
}

export async function fetchDelete(URL) {
    const response = await fetch(URL, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
        },
    });

    console.log('deleteFetch invoked:', response);
    return response;
}
