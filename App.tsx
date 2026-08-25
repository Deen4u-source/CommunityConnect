import InteractiveApp from './InteractiveApp';
import { AuthGate } from './src/providers/AuthGate';

export default function App() {
	return <AuthGate><InteractiveApp /></AuthGate>;
}
