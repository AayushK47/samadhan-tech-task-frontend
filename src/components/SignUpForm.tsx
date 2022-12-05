import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


interface ISignupForm {
    name: string;
    email: string;
    password: string;
}

interface SignUpFormProps{
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

function SignUpForm({setToken}: SignUpFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<ISignupForm>();
    const onSubmit: SubmitHandler<ISignupForm> = data => {
        registerUser({ variables: { name: data.name, email: data.email, password: data.password } })
    };
    const [logintoFb, { data }] = useMutation(gql`
        mutation fbLogin($email: String!, $name: String!){
            fbLogin(email: $email, name: $name) {
                token
                message
            }
        }`
    );

    const [registerUser, { data: loginData, loading }] = useMutation(gql`
        mutation register($name: String!, $email: String!, $password: String!) {
            register(name: $name, email: $email, password: $password) {
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
            localStorage.setItem("token", loginData?.register.token);
            setToken(loginData?.register.token);
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
                <h1 className="text-center text-xl font-bold mb-5">Sign Up</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2">
                            Name
                        </label>
                        <input {...register("name", { required: "Name is required" })} className={`shadow appearance-none border ${ errors.name && 'border-red-600' } rounded w-full py-2 px-3 text-grey-darker`} type="text" placeholder="John Doe" />
                        <span className='text-red-600'>{ errors.name && errors.name?.message }</span>
                    </div>
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2">
                            Email
                        </label>
                        <input {...register("email", { required: "Email is required", pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: "Please enter a valid email" } })} className={`shadow appearance-none border ${ errors.name && 'border-red-600' } rounded w-full py-2 px-3 text-grey-darker`} type="text" placeholder="john.doe@example.com" />
                        <span className='text-red-600'>{ errors.email && errors.email?.message }</span>
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-darker text-sm font-bold mb-2">
                            Password
                        </label>
                        <input { ...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must have atleast 8 characters" } }) } className={`shadow appearance-none border ${ errors.name && 'border-red-600' } rounded w-full py-2 px-3 text-grey-darker`} type="password" placeholder="********" />
                        <span className='text-red-600'>{ errors.password && errors.password?.message }</span>
                    </div>
                    <div className="">
                        <button className="bg-blue-600 w-full p-1 text-white rounded-lg" type="submit">
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className='text-center opacity-20'>or</p>
                <button style={{ backgroundColor: '#4267b2', color: '#fff', fontSize: '16px', padding: '12px 24px', border: 'none', borderRadius: '4px' }} onClick={fbLogin}>Register with Facebook</button>
            </div>
        </div>
    )
}

export default SignUpForm;