function AddCredential() {
  return (
    <div>
      <h2>Add Credential</h2>

      <form>

        <input placeholder="Website Name" />

        <input placeholder="Website URL" />

        <input placeholder="Username" />

        <input
          type="password"
          placeholder="Password"
        />

        <select>
          <option>Personal</option>
          <option>Work</option>
          <option>Social</option>
          <option>Banking</option>
        </select>

        <textarea placeholder="Notes"></textarea>

        <button>Save Credential</button>

      </form>
    </div>
  );
}

export default AddCredential;