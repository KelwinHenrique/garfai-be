// Helper to fetch image and convert to base64
const fetchImageAsBase64 = async (
  baseUrl: string,
  partialLogoUrl: string | null | undefined,
): Promise<string | null> => {
  if (!partialLogoUrl) {
    return null
  }
  try {
    let fullImageUrl = partialLogoUrl
    // Construct full URL if it's a relative path from iFood
    if (!partialLogoUrl.startsWith('http')) {
      fullImageUrl = `${baseUrl}${partialLogoUrl}`
    }

    // console.log(`Fetching image from: ${fullImageUrl}`); // For debugging
    const response = await fetch(fullImageUrl)
    if (!response.ok) {
      console.warn(
        `Failed to fetch image ${fullImageUrl}: ${response.status} ${response.statusText}`,
      )
      return null
    }
    const imageBuffer = await response.arrayBuffer()
    const base64String = Buffer.from(imageBuffer).toString('base64')

    // Determine MIME type to prepend to the base64 string
    // const mimeType = response.headers.get('content-type') || 'image/jpeg'; // Default or derive
    // return `data:${mimeType};base64,${base64String}`;
    // For simplicity and to avoid issues if content-type is not perfectly reliable,
    // just returning the raw base64 string. The client can infer or assume.
    return base64String
  } catch (error: any) {
    console.warn(
      `Error fetching or converting image for URL ${partialLogoUrl}: ${error.message}`,
    )
    return null
  }
}

export default fetchImageAsBase64
