import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

interface HomePageProps {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

function HomePage({ token, setToken }: HomePageProps) {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(gql`
        query {
            user {
                id, name, email
            }
        }
    `);

    useEffect(() => {
        if(!token) {
            navigate('/signup');
        }
    }, []);
    return (
        <>
            <Navbar token={token} setToken={setToken} />
            <div className="mt-10 flex justify-center">
                {
                    data && data.user &&
                    <table className="shadow-lg bg-white">
                        <thead>
                            <tr>
                                <th className="bg-blue-100 border text-left px-8 py-4">User ID</th>
                                <th className="bg-blue-100 border text-left px-8 py-4">Name</th>
                                <th className="bg-blue-100 border text-left px-8 py-4">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-8 py-4">{ data.user.id }</td>
                                <td className="border px-8 py-4">{ data.user.name }</td>
                                <td className="border px-8 py-4">{ data.user.email }</td>
                            </tr>
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}

export default HomePage;