import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface ILoginForm {
    email: string;
    password: string;
}

interface LoginFormProps{
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

function LoginForm({setToken}: LoginFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }} = useForm<ILoginForm>()

    const onSubmit: SubmitHandler<ILoginForm> = (data) => {
        basicLogin({ variables: { email: data.email, password: data.password } });
    };

    const [logintoFb, { data, loading: fbLoading, error }] = useMutation(gql`
        mutation fbLogin($email: String!, $name: String!){
            fbLogin(email: $email, name: $name) {
                token
                message
            }
    }`);

    const [basicLogin, { data: loginData, loading }] = useMutation(gql`
        mutation login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                message
            }
        }
    `)

    useEffect(() => {
        if(data) {
            localStorage.setItem("token", data?.fbLogin.token);
            setToken(data?.fbLogin.token);
            navigate('/');
        }
        if(loginData) {
            localStorage.setItem("token", loginData?.login.token);
            setToken(data?.fbLogin.token);
            navigate('/');
        }
    }, [data, loginData]);
    
    function fbLogin() {
        // @ts-ignore
        window.FB.login((response) => {
            // @ts-ignore
            window.FB.api(`${response.authResponse.userID}?fields=id,first_name,last_name,middle_name,name,email
            `,
                function (response: any) {
                    if (response && !response.error) {
                        logintoFb({ variables: { name: response.name, email: response.email } })
                    }
                }
            )
        });
    }
    return (
        <div className="flex justify-center mt-32">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/3">
                <h1 className="text-center text-xl font-bold mb-5">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                            Email
                        </label>
                        <input {...register("email", { required: "Email is required", pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: "Please enter a valid email" } })} className={`shadow appearance-none border ${ errors.email && 'border-red-600'} rounded w-full py-2 px-3 text-grey-darker`} id="username" type="text" placeholder="john.doe@example.com" />
                        <p className="text-red-600">{errors.email && errors.email?.message}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input {...register("password", { required: "Password is required" })} className={`shadow appearance-none border border-red ${ errors.password && 'border-red-600'} rounded w-full py-2 px-3 text-grey-darker`} id="password" type="password" placeholder="********" />
                        <p className="text-red-600">{errors.password && errors.password?.message}</p>
                    </div>
                    <div className="">
                        <button className="bg-blue-600 w-full p-1 text-white rounded-lg" type="submit">
                            Login
                        </button>
                    </div>
                </form>
                <p className='text-center opacity-20'>or</p>
                <button style={{ backgroundColor: '#4267b2', color: '#fff', fontSize: '16px', padding: '12px 24px', border: 'none', borderRadius: '4px' }} onClick={fbLogin}>Login with Facebook</button>
            </div>
        </div>
    )
}

export default LoginForm;