import NavbarProfile from "./NavbarProfile";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold text-primary">
          Task Manager
        </a>
      </div>
      <NavbarProfile />
    </div>
  );
}
