export async function  getProducts(url: string, forceRefresh: boolean = false) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Add cache-busting parameter when force refreshing
    const finalUrl = url;

    const res = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${"9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a"}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable cache when force refreshing
      // next: forceRefresh ? undefined : { revalidate: 300 }, // No revalidation when force refreshing
      signal: controller.signal,
      redirect: "follow"
    });


    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('API Response time:', 'Data received:', data);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout after 10 seconds');
      throw new Error('Request timeout. Please try again.');
    }
    console.error("API Error:", error);
    throw error;
  }
}

export async function deleteProduct(productId: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const url = `https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/products/${productId}`;
    console.log('Delete API: Making DELETE request to:', url);

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${"9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a"}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      redirect: "follow"
    });

    clearTimeout(timeoutId);
    console.log('Delete API: Response status:', res.status);
    console.log('Delete API: Response ok:', res.ok);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Delete API: Error response:', errorData);
      throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json().catch(() => ({ success: true }));
    console.log('Delete API: Success response:', data);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Delete API: Request timeout after 10 seconds');
      throw new Error('Request timeout. Please try again.');
    }
    console.error("Delete API: Error:", error);
    throw error;
  }
}
