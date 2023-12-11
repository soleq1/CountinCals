import App from "../App";
import { Favorites } from "./Favorites";

const routes = {
    '/': () => <App />,
    '/favorites': () => <Favorites />

}

export default routes;