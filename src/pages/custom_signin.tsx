import type { NextPage } from 'next';
import { getProviders, useSession, getCsrfToken, signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Suspense, useRef } from 'react';

const wrapPromise = <T,>(promise: Promise<T>): { read: () => T } => {
    let status = 'pending';
    let result: T;
    const suspender = promise.then(
        (r) => {
            status = 'fulfilled';
            result = r;
        },
        (e) => {
            status = 'rejected';
            result = e;
        }
    );
    const read = () => {
        if (status === 'pending') {
            throw suspender;
        } else if (status === 'rejected') {
            throw result;
        } else {
            return result;
        }
    };
    return { read };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {},
    };
};

const Home: NextPage<{ csrfToken: string }> = ({ csrfToken }) => {
    const { data: session, status } = useSession();
    const email = useRef<HTMLInputElement>(null);
    const promise = wrapPromise(getProviders());

    const SigninArea = () => {
        const providers = promise.read();
        return (
            <>
                {Object.values(providers!).map((provider) => {
                    return (
                        <p key={provider.id}>
                            {provider.id === 'email' ? (
                                <>
                                    <input ref={email} autoFocus type="email" name="email" placeholder="email@example.com" />
                                    <button onClick={() => signIn(provider.id, { email: email.current?.value, redirect: false }).then((res) => console.warn(res))}>
                                        Sign in with {provider.name}
                                    </button>{' '}
                                </>
                            ) : (
                                <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                            )}
                        </p>
                    );
                })}
            </>
        );
    };

    if (status === 'authenticated') {
        return (
            <div>
                <p>Signed in as {session.user!.email}</p>
                <p>Expires: {session.expires}</p>
                <button onClick={() => signOut({ callbackUrl: '/custom_signin' })}>Sign out</button>
            </div>
        );
    } else if (status === 'unauthenticated') {
        return (
            <div>
                <p>Not signed in</p>
                <Suspense fallback={<p>Loading...</p>}>
                    <SigninArea />
                </Suspense>
            </div>
        );
    } else {
        return <></>;
    }
};

export default Home;
