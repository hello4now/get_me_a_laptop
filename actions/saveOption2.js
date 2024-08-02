export async function saveOption2(options) {
  try {
    console.log('saveOption2 called with options:', options);

    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to save options');
    }

    const result = await response.json();
    console.log('Response result:', result);

    // Debugging: log the type of result
    console.log('Result is an array:', Array.isArray(result));

    if (Array.isArray(result)) {
      console.log('First element of result array:', result[0]);
    } else {
      console.error('Expected an array but got:', typeof result);
    }

    return result; // Expecting an array of laptop recommendations
  } catch (error) {
    console.error('Error in saveOption2:', error);
    throw error;
  }
}
