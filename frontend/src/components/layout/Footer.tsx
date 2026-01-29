import { Dumbbell } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-primary-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Dumbbell className="h-6 w-6 text-primary-600" />
                        <span className="ml-2 text-lg font-bold text-primary-950">FitMinds</span>
                    </div>
                    <p className="text-sm text-primary-700">
                        &copy; {new Date().getFullYear()} FitMinds. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
