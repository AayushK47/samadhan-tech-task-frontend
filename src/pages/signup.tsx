import SignUpForm from "../components/SignUpForm";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface SignUpProps{
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

function SignUp({ token, setToken }: SignUpProps) {
    const navigate = useNavigate();

    useEffect(() => {
        if(token) {
            navigate('/');
        }
    }, []);

    return (
        <>
            <Navbar token={token} setToken={setToken} />
            <SignUpForm setToken={setToken} />
        </>
    )
}

export default SignUp;