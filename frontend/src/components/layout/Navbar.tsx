import { Link } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);



    return (
        <nav className="border-b bg-white border-primary-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Dumbbell className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-primary-950">FitMinds</span>
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:space-x-8 sm:items-center">
                        <Link to="/" className="text-primary-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
                        <a href="/#plans" className="text-primary-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Subscription Plans</a>
                        <Link to="/register-trainer" className="text-primary-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Work With Us</Link>
                        <div className="flex items-center space-x-4 ml-4">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register-member">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-primary-400 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-primary-500 text-base font-medium text-primary-700 bg-primary-50">Home</Link>
                        <a href="/#plans" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 hover:border-primary-300">Subscription Plans</a>
                        <Link to="/register-trainer" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 hover:border-primary-300">Work With Us</Link>
                        <div className="mt-4 px-4 space-y-2">
                            <Link to="/login" className="block w-full">
                                <Button variant="ghost" className="w-full justify-start">Login</Button>
                            </Link>
                            <Link to="/register-member" className="block w-full">
                                <Button className="w-full justify-start">Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}