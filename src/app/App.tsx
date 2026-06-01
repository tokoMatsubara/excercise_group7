import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./store";

export default function App() {
  return (
    /* MARKER-MAKE-KIT-INVOKED */
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
