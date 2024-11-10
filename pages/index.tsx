import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth';

import Link from 'next/link'

const client = generateClient<Schema>();

function Index() {
  const [currentUser, setCurrentUser] = useState('');
  const [programs, setPrograms] = useState<Array<Schema["Program"]["type"]>>([]);

  useEffect(() => {

    client.models.Program.observeQuery().subscribe({
      next: (data) => setPrograms([...data.items]),
    });

    const fetchUser = async () => {
      try {
        const { username } = await getCurrentUser();
        setCurrentUser(username);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <main>
      <section className="hero is-success">
        <div className="hero-body">
          <p className="title">Programs</p>
          <p className="subtitle">Available Programs</p>
        </div>
      </section>
      {!currentUser &&
        <section className="section">
          <Link href="/dashboard">Log In</Link>
        </section>
      }
      <section className="section">
        {programs.map((program) => (
          <div key={program.id}>
            <div>
              <p>{program.id}</p>
              <p>{program.name}</p>
              <p>{program.description}</p>
              <a href="https://buy.stripe.com/test_eVa29jcMbg1l5rieUU" target="_blank">Purchase</a>
            </div>
            <br />
          </div>
        ))}
      </section>
    </main>
  );
}

export default Index;