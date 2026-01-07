import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadImage } from '@/lib/cloudinary';
import { authOptions } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    try {
      const imageUrl = await uploadImage(buffer);
      return NextResponse.json({ url: imageUrl });
    } catch (uploadError: unknown) {
      console.error('Cloudinary upload error:', uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload image';
      
      // Provide more helpful error messages
      let statusCode = 500;
      if (errorMessage.includes('authentication failed') || errorMessage.includes('API key')) {
        statusCode = 401;
      } else if (errorMessage.includes('Bad request') || errorMessage.includes('Invalid request')) {
        statusCode = 400;
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        hint: errorMessage.includes('Cloudinary') ? 'Please verify your Cloudinary credentials in Vercel environment variables' : undefined
      }, { status: statusCode });
    }
  } catch (error: unknown) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

