function SearchForm({onFilterChange}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({
      name: event.target.name.value,
      department: event.target.department.value,
      type: event.target.type.value,
      ignoreClosed: event.target.ignoreClosed.checked,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Nom
      </label>
      <input type="text" name="name"/>
      <br/>
      <label htmlFor="departement">
        Département
      </label>
      <input type="text" name="department"/>
      <br/>
      <input id="entreprise" type="radio" name="type" value="entreprise" defaultChecked/>
      <label htmlFor="entreprise">Entreprise</label>
      <input id="association" type="radio" name="type" value="association"/>
      <label htmlFor="association">Association</label>
      <br/>
      <input id="ignoreClosed" type="checkbox" name="ignoreClosed" value="ignoreClosed" defaultChecked/>
      <label htmlFor="ignoreClosed">Exclure les établissements fermés</label>
      <br/>

      <input type="submit" value="Rechercher"/>
    </form>
  )
}

export default SearchForm;