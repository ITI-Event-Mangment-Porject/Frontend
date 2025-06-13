export default function SetupForm() {
  return (
    <div>
      <h1>Company Setup Form</h1>
      <form>
        <div>
          <label htmlFor="companyName">Company Name:</label>
          <input type="text" id="companyName" name="companyName" required />
        </div>
        <div>
          <label htmlFor="industry">Industry:</label>
          <input type="text" id="industry" name="industry" required />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}