import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

const Home: NextPage = () => {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        console.log(`session:${JSON.stringify(session)}`);
        return (
            <div>
                <p>Signed in as {session.user!.email}</p>
                <p>Expires: {session.expires}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    } else {
        return (
            <div>
                <p>Not signed in</p>
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        );
    }
};

export default Home;
