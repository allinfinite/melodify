/**
 * Suno API client for music generation (via SunoAPI.org)
 */

export interface SunoGenerateRequest {
  input_audio_url: string;
  style: string;
  prompt?: string;
  make_instrumental?: boolean;
  wait_audio?: boolean;
}

export interface SunoGenerateResponse {
  id: string;
  status: 'queued' | 'processing' | 'complete' | 'error';
  audio_url?: string;
  video_url?: string;
  image_url?: string;
  metadata?: {
    title?: string;
    tags?: string[];
    duration?: number;
  };
  error_message?: string;
}

/**
 * Generate a song using Suno API (via SunoAPI.org)
 */
export async function generateSong(
  fileUrl: string,
  style: string,
  prompt?: string
): Promise<SunoGenerateResponse> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    throw new Error('SUNO_API_KEY not configured');
  }

  try {
    console.log('🎵 Calling SunoAPI.org Add Instrumental...');
    console.log('Style:', style);
    console.log('Prompt:', prompt);
    
    // Build the absolute audio URL if it's relative
    let absoluteAudioUrl = fileUrl;
    if (fileUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      absoluteAudioUrl = `${baseUrl}${fileUrl}`;
      console.log('Converted to absolute URL:', absoluteAudioUrl);
    }
    
    // Use the correct Add Instrumental endpoint
    // This endpoint adds instrumental backing to a vocal track
    const requestBody = {
      uploadUrl: absoluteAudioUrl,  // The vocal track to add music to
      title: `${style} Remix`,      // Title of the track
      tags: prompt || `${style}, upbeat, modern`, // Style tags for the instrumental
      negativeTags: 'harsh, aggressive, distorted', // Styles to avoid
      callBackUrl: 'https://api.example.com/callback', // Required but we'll poll instead
      model: 'V4_5PLUS',           // Latest model (best quality)
      audioWeight: 0.7,            // Balance between vocals and instrumental (0.7 = keep vocals clear)
      styleWeight: 0.65,           // How much to follow the style (0.65 = moderate adherence)
      weirdnessConstraint: 0.5,    // Creative variation (0.5 = moderate creativity)
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.sunoapi.org/api/v1/generate/add-instrumental', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Suno API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    // SunoAPI.org returns: { code: 200, msg: "success", data: { taskId: "..." } }
    console.log('Full API result:', JSON.stringify(result, null, 2));
    
    if (result.code !== 200 || !result.data?.taskId) {
      console.error('Unexpected response format:', result);
      throw new Error(result.msg || 'Failed to start generation');
    }
    
    const taskId = result.data.taskId;
    console.log('✅ Task started with ID:', taskId);
    
    // Poll for completion using the correct endpoint
    console.log('⏳ Polling for completion...');
    const completedTask = await pollTaskStatus(taskId, apiKey);
    
    return completedTask;
  } catch (error) {
    console.error('Suno API error:', error);
    throw error;
  }
}

/**
 * Poll the task status until completion
 */
async function pollTaskStatus(
  taskId: string,
  apiKey: string,
  maxAttempts: number = 60, // 60 attempts = up to 5 minutes
  delayMs: number = 5000      // Check every 5 seconds
): Promise<SunoGenerateResponse> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`📊 Polling attempt ${attempt}/${maxAttempts}...`);
    
    try {
      const status = await getGenerationStatus(taskId, apiKey);
      
      if (status.status === 'complete' && status.audio_url) {
        console.log('✅ Generation complete!');
        return status;
      }
      
      if (status.status === 'error') {
        throw new Error(status.error_message || 'Generation failed');
      }
      
      console.log(`⏳ Status: ${status.status}, waiting ${delayMs/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    } catch (error: any) {
      console.error(`Polling attempt ${attempt} failed:`, error.message || error);
      
      if (attempt === maxAttempts) {
        throw new Error(`Generation timeout after ${maxAttempts} attempts (${(maxAttempts * delayMs) / 1000}s). The task may still be processing.`);
      }
      
      // Continue polling on transient errors
      console.log(`⏳ Retrying in ${delayMs / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error(`Generation timeout - exceeded ${maxAttempts} polling attempts`);
}

/**
 * Check the status of a generation job
 */
export async function getGenerationStatus(
  taskId: string,
  apiKey?: string
): Promise<SunoGenerateResponse> {
  const key = apiKey || process.env.SUNO_API_KEY;

  if (!key) {
    throw new Error('SUNO_API_KEY not configured');
  }

  // Use the correct endpoint: GET /api/v1/generate/record-info?taskId={taskId}
  const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`;
  console.log('Checking task status at:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${key}`,
    },
  });

  console.log('Status check response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Status check failed:', response.status, errorText);
    throw new Error(`Suno API error: ${response.status}`);
  }

  const result = await response.json();
  console.log('Task status response:', JSON.stringify(result, null, 2));
  
  // Parse the SunoAPI.org response format
  if (result.code !== 200) {
    throw new Error(result.msg || 'Failed to get task status');
  }
  
  const data = result.data;
  const status = mapStatus(data.status);
  
  // Extract audio data from sunoData array
  const sunoData = data.response?.sunoData?.[0]; // Get first track
  
  return {
    id: taskId,
    status: status,
    audio_url: sunoData?.audioUrl || sunoData?.streamAudioUrl,
    video_url: undefined,
    image_url: sunoData?.imageUrl,
    metadata: {
      title: sunoData?.title,
      tags: sunoData?.tags?.split(',').map((t: string) => t.trim()) || [],
      duration: sunoData?.duration,
    },
    error_message: data.errorMessage,
  };
}

/**
 * Map SunoAPI.org status to our status format
 * Status values: PENDING, TEXT_SUCCESS, FIRST_SUCCESS, SUCCESS, or error states
 */
function mapStatus(apiStatus: string): 'queued' | 'processing' | 'complete' | 'error' {
  if (!apiStatus) return 'queued';
  
  const status = apiStatus.toUpperCase();
  
  // Success states
  if (status === 'SUCCESS') {
    return 'complete';
  }
  
  // Error states
  if (status.includes('FAILED') || status.includes('ERROR')) {
    return 'error';
  }
  
  // Processing states
  if (status === 'TEXT_SUCCESS' || status === 'FIRST_SUCCESS') {
    return 'processing';
  }
  
  // Pending
  if (status === 'PENDING') {
    return 'queued';
  }
  
  return 'queued';
}

/**
 * Mock implementation for development/testing
 * Remove this in production when using real Suno API
 */
export async function generateSongMock(
  fileUrl: string,
  style: string,
  prompt?: string
): Promise<SunoGenerateResponse> {
  console.log('🎭 Mock mode: Simulating generation...');
  console.log('Input file URL:', fileUrl);
  console.log('Style:', style);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const result = {
    id: `mock_${Date.now()}`,
    status: 'complete' as const,
    audio_url: fileUrl, // Return the input as output for testing
    metadata: {
      title: `${style} Remix (Mock)`,
      tags: [style, 'ai-generated', 'mock'],
      duration: 180,
    },
  };
  
  console.log('✅ Mock result:', result);
  return result;
}
