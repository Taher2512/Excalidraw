export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <input type="email" placeholder="Enter email" />
      <input type="password" placeholder="Enter password" />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        {isSignIn ? "Sign In" : "Sign Up"}
      </button>
    </div>
  );
}
