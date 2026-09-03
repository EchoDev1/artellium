import { redirect } from 'next/navigation';

export default function LostMasterpieceRedirect() {
  redirect('/catalog');
}
