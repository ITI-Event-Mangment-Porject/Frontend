function Footer() {
  return (
    <footer className="bg-white shadow w-full">
      <div className="py-4 px-6 w-full">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CommunITI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
