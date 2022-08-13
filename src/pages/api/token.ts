import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
    const token = await getToken({ req });
    if (token) {
        // Signed in
        console.log('JSON Web Token', JSON.stringify(token, null, 2));
        res.send({
            content: JSON.stringify(token, null, 2),
        });
    } else {
        // Not Signed in
        res.status(401).send('401 refused');
    }
    res.end();
};

export default handler;
