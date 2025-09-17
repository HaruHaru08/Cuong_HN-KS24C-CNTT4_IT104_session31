import { createBrowserRouter } from "react-router-dom";
import ListPost from "../page/ListPost";

export const routers = createBrowserRouter([
  {
    path: "/list-post",
    element: <ListPost></ListPost>,
  },
]);
