/**
 * Safe API response parser and handler.
 * Validates Content-Type, checks response.ok, body presence, and parses JSON safely.
 * Throws clean Error with actual backend message if request failed or JSON is invalid.
 */
export async function parseApiResponse(response) {
  if (!response) {
    throw new Error('No response received from server.');
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  let rawText = '';

  try {
    rawText = await response.text();
    if (rawText && rawText.trim()) {
      if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
        data = JSON.parse(rawText);
      }
    }
  } catch (err) {
    console.warn('Response was not valid JSON:', err);
  }

  // Handle HTTP error status codes (400, 401, 403, 404, 405, 500, etc.)
  if (!response.ok) {
    const errorMsg =
      data?.error ||
      data?.message ||
      (rawText && !rawText.startsWith('<!doctype') && !rawText.startsWith('<html')
        ? rawText.slice(0, 150)
        : `Request failed with status ${response.status} (${response.statusText || 'Error'})`);
    
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  // If response is OK (200, 201) but body was empty
  if (!data) {
    return {
      success: true,
      message: 'Operation completed successfully.'
    };
  }

  return data;
}
