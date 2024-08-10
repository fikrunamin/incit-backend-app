const axios = require('axios');

async function googleLogin(req, res) {
    try {
        const code = req.headers.authorization;

        const response = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                code,
                client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
                client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
                redirect_uri: 'postmessage',
                grant_type: 'authorization_code'
            }
        );

        const accessToken = response.data.access_token;

        const userResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const userDetails = userResponse.data;
        console.log('User Details:', userDetails);

        res.status(200).json({
            message: 'User authenticated successfully',
            code: 200,
            success: true,
            data: userDetails
        });
    } catch (error) {
        console.error('Error authenticating user with Google:', error);

        res.status(500).json({
            error: error.message,
            code: 500
        });
    }
}

module.exports = {
    google: {
        login: googleLogin,
    }
};