import fs from 'fs';

(async function getToken() {
    try {
        const resp = await fetch(
            'https://verbose-winner-x556qxv96gvpf97w7-5000.app.github.dev/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ email: 'kishore@gmail.com', password: 'k123' }),
            },
        );

        const data = await resp.json();

        console.log('Login response:', data);

        const token = data?.token || data?.jwt || data?.accessToken || data?.data?.token;
        if (!token) {
            console.error('Token not found in response');
            process.exit(1);
        }

        console.log('Token:', token);

        // Save token to token.txt for convenience
        try {
            fs.writeFileSync('token.txt', token, { encoding: 'utf8' });
            console.log('Saved token to token.txt');
        } catch (err) {
            console.warn('Failed to write token.txt:', err.message);
        }

        // Try fetching follow-ups with the token to verify access
        try {
            const fResp = await fetch('https://verbose-winner-x556qxv96gvpf97w7-5000.app.github.dev/api/followups', {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });

            if (fResp.status === 401) {
                const body = await fResp.text();
                console.error('Follow-ups request unauthorized:', body);
                process.exit(1);
            }

            const fData = await fResp.json();
            console.log(`/followups returned ${Array.isArray(fData) ? fData.length : 'unknown'} items`);
            if (Array.isArray(fData) && fData.length > 0) {
                console.log('Sample follow-up:', JSON.stringify(fData[0], null, 2));
            }
        } catch (err) {
            console.error('Error fetching follow-ups with token:', err.message);
        }
    } catch (error) {
        console.error('Login request failed:', error.message);
        process.exit(1);
    }
})();
