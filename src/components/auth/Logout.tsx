import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await signOut(auth);
                navigate("/");
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                setLoading(false);
            }
        };
        performLogout();
    }, [navigate]);

    return <div>{loading ? "Logging out..." : "Logged out"}</div>;
};

export default Logout;