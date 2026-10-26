import { redirect } from 'next/navigation';

export default function WeAreBuiltPage() {
  redirect('/about#vision');
}
