import ResumeCard from "~/components/ResumeCard.jsx";
import Navbar from "../components/Navbar.jsx";
import { resumes } from "~/constants";
import React, { useEffect } from "react";
import { usePuterStore } from "~/lib/putur.js";
import { useNavigate } from "react-router";

export default function Home() {

    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect( () =>{
        if(!auth.isAuthenticated) navigate('auth?next=/');
    },[auth.isAuthenticated])

  return (
    <main className="bg-[url('https://img.freepik.com/premium-vector/soft-pink-gradient-background-pastel-colors-pink-liquid-dynamic-shapes-abstract-composition_293525-1092.jpg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Monitor your job applications & resume scores</h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-section mx-2 px-2">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
