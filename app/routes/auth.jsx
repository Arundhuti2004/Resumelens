import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/putur'

export const meta = () => ([
    {title : 'Resumelens' | 'Auth'},
    {name : 'description' , content : 'Log into your account'},
])

const auth = () => {
    const { isLoading ,auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect( () =>{
        if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next])
  return (
    <main  className="bg-[url('https://img.freepik.com/premium-vector/soft-pink-gradient-background-pastel-colors-pink-liquid-dynamic-shapes-abstract-composition_293525-1092.jpg')] bg-cover min-h-screen flex items-center justify-center">
        <div className='grediant-border shadow-lg'>
            <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <h1>Welcome</h1>
                    <h2>Log In to Continue Your Job Journey</h2>
                </div>
                <div>
                    {isLoading ? (
                        <button className='auth-button animate-pulse'>
                            <p>Signing you in...</p>
                        </button>
                    ): (
                        <>
                        {auth.isAuthenticated ? (
                            <button className='auth-button' onClick={auth.signOut}>
                                <p>Log Out</p>
                            </button>
                        ):(
                            <button className='auth-button' onClick={auth.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                        </>
                    )}
                </div>

            </section>
        </div>
    </main>
  )
}

export default auth
