// Netlify Function to securely fetch Airtable data
// Token is hidden in environment variables

exports.handler = async function(event, context) {
    const { student } = event.queryStringParameters || {};
    
    // Token stored securely in Netlify environment variables
    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE_ID = process.env.BASE_ID || 'appDxcv3BlLT1jkCL';
    
    if (!AIRTABLE_TOKEN) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API token not configured' })
        };
    }
    
    if (!student) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Student name required' })
        };
    }
    
    // Map student names to view names
    const viewNames = {
        'fiona': 'Fiona - Portfolio',
        'hope': 'Hope - Portfolio',
        'olivia': 'Olivia - Portfolio'
    };
    
    const viewName = viewNames[student.toLowerCase()];
    
    if (!viewName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid student name' })
        };
    }
    
    try {
        // Fetch from Airtable
        const response = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/Experiences?view=${encodeURIComponent(viewName)}`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        console.error('Error fetching from Airtable:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to fetch experiences',
                message: error.message 
            })
        };
    }
};
