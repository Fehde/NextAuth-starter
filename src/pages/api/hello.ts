import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    console.warn(session);

    if (session) {
        // res.status(200).json({ name: 'John Doe' })
        res.send({
            content: 'Hello Premitted.',
        });
    } else {
        res.send({
            error: 'Hello Protected.',
        });
    }
};

export default handler;
