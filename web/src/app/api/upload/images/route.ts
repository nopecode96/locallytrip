/// <reference types="node" />

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

// Force Node.js runtime for file system operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    
    // Multiple path resolution strategies
    const possiblePaths = [
      // For development when running from web directory
      join(process.cwd(), '../backend/public/images/experiences'),
      // For development when running from root
      join(process.cwd(), 'backend/public/images/experiences'),
      // Absolute fallback
      resolve('/Users/nopelavanda/development/localtrip/locallytrip/backend/public/images/experiences')
    ];
    
    let uploadDir = null;
    for (const path of possiblePaths) {
      console.log('Trying path:', path);
      try {
        if (!existsSync(path)) {
          await mkdir(path, { recursive: true });
        }
        uploadDir = path;
        console.log('Using upload directory:', uploadDir);
        break;
      } catch (err) {
        console.log('Path failed:', path, err);
        continue;
      }
    }
    
    if (!uploadDir) {
      throw new Error('Could not create upload directory');
    }

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `experience-${timestamp}-${randomNum}.${extension}`;
      
      console.log('Generated filename:', filename);
      
      try {
        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filepath = join(uploadDir, filename);
        console.log('Saving to:', filepath);
        
        await writeFile(filepath, buffer);
        
        uploadedFiles.push(filename);
        console.log('File saved successfully:', filename);
      } catch (fileError) {
        console.error('Error saving file:', filename, fileError);
        continue;
      }
    }

    console.log('Upload completed. Files saved:', uploadedFiles);

    if (uploadedFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid images could be uploaded'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: { filenames: uploadedFiles }
    });
    
  } catch (error) {
    console.error('=== Image upload error ===', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload images',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
