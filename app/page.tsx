import { redirect } from 'next/navigation';
import { LoginScreen } from './components/login-screen';
import { getCurrentUser, homeForUser } from './lib/auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect(homeForUser(user));

  return <LoginScreen />;
}
