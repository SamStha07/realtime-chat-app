import { addFriendValidator } from '@/lib/validations/add-friend';

// export async function GET
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);
  } catch (err) {}
}
