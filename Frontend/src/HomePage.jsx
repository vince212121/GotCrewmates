import { Link } from "react-router-dom";

export const Home = ({match}) => {
    return (
        <div>
            This is the home page.
            <Link to ="Page1"> Link to page 1
            </Link>
        </div>

        
    );
};