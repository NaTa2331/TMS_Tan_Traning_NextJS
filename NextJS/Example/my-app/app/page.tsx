// app/page.tsx
import GreetingForm from '../components/GreetingForm';
import DashboardLink from '../components/DashboardLink';

export default function HomePage() {
  return (
    <div className="app-container">
      <GreetingForm />
    </div>
  );
}