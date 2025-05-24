/**
 * Health check utility for testing backend connectivity
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

/**
 * Test backend connectivity
 * @returns {Promise<Object>} Health check results
 */
export const checkBackendHealth = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    overall: 'unknown',
    tests: []
  };

  const endpoints = [
    { url: `${BASE_URL}/`, name: 'Root Endpoint', critical: true },
    { url: `${BASE_URL}/health`, name: 'Health Check', critical: true },
    { url: `${API_URL}/health`, name: 'API Health Check', critical: true },
    { url: `${API_URL}/todos`, name: 'Todos Endpoint', critical: false }
  ];

  let criticalPassed = 0;
  let criticalTotal = 0;

  for (const endpoint of endpoints) {
    if (endpoint.critical) criticalTotal++;

    const test = {
      name: endpoint.name,
      url: endpoint.url,
      critical: endpoint.critical,
      status: 'unknown',
      responseTime: 0,
      error: null,
      data: null
    };

    try {
      const startTime = Date.now();
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // Add timeout
        signal: AbortSignal.timeout(5000)
      });

      test.responseTime = Date.now() - startTime;
      test.status = response.ok ? 'success' : 'error';
      test.statusCode = response.status;

      if (response.ok && endpoint.critical) {
        criticalPassed++;
      }

      // Try to parse JSON response
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          test.data = await response.json();
        } else {
          test.data = await response.text();
        }
      } catch (parseError) {
        test.data = 'Could not parse response';
      }

    } catch (error) {
      test.status = 'error';
      test.error = error.message;
      
      if (error.name === 'TimeoutError') {
        test.error = 'Request timeout (5s)';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        test.error = 'Network error - Backend may be offline';
      }
    }

    results.tests.push(test);
  }

  // Determine overall health
  if (criticalPassed === criticalTotal) {
    results.overall = 'healthy';
  } else if (criticalPassed > 0) {
    results.overall = 'degraded';
  } else {
    results.overall = 'unhealthy';
  }

  results.summary = {
    criticalPassed,
    criticalTotal,
    totalTests: endpoints.length,
    passedTests: results.tests.filter(t => t.status === 'success').length
  };

  return results;
};

/**
 * Simple ping test for quick connectivity check
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const pingBackend = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend ping failed:', error.message);
    return false;
  }
};

/**
 * Get backend configuration info
 * @returns {Promise<Object|null>} Backend config or null if unavailable
 */
export const getBackendInfo = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.warn('Could not get backend info:', error.message);
    return null;
  }
};
