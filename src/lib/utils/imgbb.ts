/**
 * Upload an image file to ImgBB and return the direct image URL.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('ImgBB API key is not configured');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', apiKey);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to ImgBB');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Image upload failed');
  }

  return data.data.display_url;
}
