import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import AppRoutes from "./routes";
import store from "./store";
import "./assets/css/main.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light">
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
