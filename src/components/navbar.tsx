import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps{
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

function Navbar({ token, setToken }: NavbarProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  }
  return ( 
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                    <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                    />
                </div>
                <div className="">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {
                        !token &&
                        <Link
                            to='/login'
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Login
                        </Link>
                      }
                      {
                        !token &&
                        <Link
                            to='/signup'
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Signup
                        </Link>
                      }
                      {
                        token &&
                        <div
                          onClick={logout}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </div>
                      }
                    </div>
                </div>
            </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
