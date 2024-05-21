import { useParams } from 'react-router-dom';

function InvitePage() {
  const { token } = useParams<{ token: string }>();
  
  // Use the token to verify the invite or perform other actions
  return <div>Welcome! Your invite token is {token}</div>;
}

export default InvitePage;
