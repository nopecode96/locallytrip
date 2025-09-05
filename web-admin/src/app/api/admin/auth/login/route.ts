import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Use NodeJS http module with explicit backend container IP
    const http = require('http');
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: '172.18.0.3',  // Backend container IP from docker inspect
      port: 3001,
      path: '/admin/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise<NextResponse>((resolve) => {
      const req = http.request(options, (res: any) => {
        let responseData = '';

        res.on('data', (chunk: any) => {
          responseData += chunk;
        });

        res.on('end', () => {
          
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode === 200) {
              resolve(NextResponse.json(parsedData));
            } else {
              resolve(NextResponse.json(parsedData, { status: res.statusCode }));
            }
          } catch (parseError) {
            console.error('Error parsing backend response:', parseError);
            resolve(NextResponse.json(
              { 
                success: false, 
                error: 'Parse error',
                message: 'Invalid response from backend' 
              },
              { status: 500 }
            ));
          }
        });
      });

      req.on('error', (error: any) => {
        console.error('HTTP request error:', error);
        resolve(NextResponse.json(
          { 
            success: false, 
            error: 'Connection error',
            message: 'Failed to connect to backend',
            debug: error.message 
          },
          { status: 500 }
        ));
      });

      req.write(data);
      req.end();
    });
  } catch (error: any) {
    console.error('Admin auth API error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        message: 'An error occurred during authentication',
        debug: error.message 
      },
      { status: 500 }
    );
  }
}
